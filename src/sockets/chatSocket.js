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
      return next(
        new Error("Autenticación requerida: No se proporcionó el token.")
      );
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
        return next(
          new Error("Tu sesión ha expirado. Inicia sesión de nuevo.")
        );
      } else {
        return next(new Error("Token inválido. Inicia sesión de nuevo."));
      }
    }
  });

  const connectedUsers = new Map(); // 🟢 Usuarios conectados

  io.on("connection", (socket) => {
    console.log(
      `✅ Usuario conectado: ${socket.user.name} (${socket.user.role})`
    );

    // ✅ Agregar usuario a la lista de conectados
    connectedUsers.set(socket.user.id, socket.user);

    // ✅ Emitir la lista de participantes al usuario recién conectado
    socket.emit("chat:updateParticipants", Array.from(connectedUsers.values()));

    socket.on("chat:requestParticipants", () => {
      socket.emit(
        "chat:updateParticipants",
        Array.from(connectedUsers.values())
      );
    });

    // ✅ Notificar a los demás usuarios sobre el nuevo usuario
    socket.broadcast.emit(
      "chat:updateParticipants",
      Array.from(connectedUsers.values())
    );

    // ✍️ Evento cuando el usuario está escribiendo
    socket.on("chat:typing", () => {
      socket.broadcast.emit("chat:userTyping", { user: socket.user.name });
    });

    // ✍️ Evento cuando deja de escribir
    socket.on("chat:stopTyping", () => {
      socket.broadcast.emit("chat:userStopTyping", { user: socket.user.name });
    });

    // 📩 Manejo de mensajes
    socket.on("chat:message", async (msg) => {
      try {
        jwt.verify(socket.token, process.env.JWT_SECRET);

        if (!msg.content || msg.content.trim() === "") {
          return socket.emit("chat:error", {
            error: "🚫 El mensaje no puede estar vacío.",
          });
        }

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

        io.emit("chat:message", message);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          socket.emit("chat:error", {
            error: "⏳ Tu sesión ha expirado. Inicia sesión de nuevo.",
          });
          socket.disconnect();
        } else {
          socket.emit("chat:error", {
            error: "❗ Error al enviar el mensaje.",
          });
        }
      }
    });

    // 🔌 Manejar desconexiones
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.user.id);
      console.log(`🔌 Usuario desconectado: ${socket.user.name}`);

      // Actualizar la lista de participantes
      io.emit("chat:updateParticipants", Array.from(connectedUsers.values()));
    });
  });
};

export default chatSocket;
