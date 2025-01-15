import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

/**
 *  Configura la lógica de los sockets para el chat en tiempo real.
 * - Verifica el token JWT antes de conectar.
 * - Gestiona eventos de mensajes y notificaciones de escritura.
 * 
 * @param {Object} io - Instancia de Socket.io.
 */
const chatSocket = (io) => {
  /**
   *  Middleware para autenticar usuarios al conectar.
   * - Verifica el token JWT.
   * - Valida que el usuario exista y tenga rol autorizado.
   */
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Autenticación requerida: No se proporcionó el token."));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //  Verificar si el usuario existe en la base de datos
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, role: true },
      });

      if (!user) {
        return next(new Error("Usuario no encontrado."));
      }

      //  Permitir solo roles autorizados (STUDENT y MODERATOR)
      if (user.role !== "STUDENT" && user.role !== "MODERATOR") {
        return next(new Error("Acceso denegado: Rol no autorizado."));
      }

      socket.user = user;
      socket.token = token; 
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new Error("Tu sesión ha expirado. Inicia sesión de nuevo."));
      } else {
        return next(new Error("Token inválido. Inicia sesión de nuevo."));
      }
    }
  });

  const connectedUsers = new Map();  // 🟢 Usuarios conectados

  io.on("connection", (socket) => {
    console.log(`✅ Usuario conectado: ${socket.user.name} (${socket.user.role})`);

    //  Añadir usuario a la lista de conectados
    connectedUsers.set(socket.user.id, socket.user);

    //  Notificar a todos los usuarios conectados
    io.emit("chat:updateParticipants", Array.from(connectedUsers.values()));

    /**
     *  Notificar cuando un usuario está escribiendo.
     */
    socket.on("chat:typing", () => {
      socket.broadcast.emit("chat:userTyping", { user: socket.user.name });
    });

    /**
     *  Notificar cuando un usuario deja de escribir.
     */
    socket.on("chat:stopTyping", () => {
      socket.broadcast.emit("chat:userStopTyping", { user: socket.user.name });
    });

    /**
     * Enviar un mensaje al chat.
     * - Verifica que el token siga siendo válido.
     * - Valida que el mensaje no esté vacío ni supere los 80 caracteres.
     * - Guarda el mensaje en la base de datos y lo envía a todos los usuarios.
     */
    socket.on("chat:message", async (msg) => {
      try {
        jwt.verify(socket.token, process.env.JWT_SECRET); // Verificar token

        //  Validar mensaje vacío
        if (!msg.content || msg.content.trim() === "") {
          return socket.emit("chat:error", {
            error: "🚫 El mensaje no puede estar vacío.",
          });
        }

        //  Validar longitud máxima del mensaje
        if (msg.content.length > 80) {
          return socket.emit("chat:error", {
            error: "🚫 El mensaje no puede tener más de 80 caracteres.",
          });
        }

        //  Guardar el mensaje en la base de datos
        const message = await prisma.message.create({
          data: {
            content: msg.content,
            userId: socket.user.id,
          },
          include: {
            user: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        });

        //  Enviar el mensaje a todos los usuarios conectados
        io.emit("chat:message", message);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          console.error("⏳ Token expirado durante la acción.");
          socket.emit("chat:error", {
            error: "⏳ Tu sesión ha expirado. Inicia sesión de nuevo.",
          });
          socket.disconnect();
        } else {
          console.error("🛑 Error al enviar mensaje:", error);
          socket.emit("chat:error", {
            error: "❗ Error al enviar el mensaje. Inténtalo de nuevo.",
          });
        }
      }
    });

    /**
     * 🔌 Evento al desconectarse un usuario.
     * - Se elimina al usuario de la lista de conectados.
     * - Se notifica a los demás usuarios.
     */
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.user.id);
      console.log(`🔌 Usuario desconectado: ${socket.user.name}`);

      io.emit("chat:updateParticipants", Array.from(connectedUsers.values()));
    });
  });
};

export default chatSocket;
