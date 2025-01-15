import { sendMessage, getMessages } from "../services/chatService.js";

/**
 * 📥 Controlador para enviar un mensaje.
 * - Valida el contenido.
 * - Llama al servicio para guardar el mensaje.
 */
export const postMessage = async (req, res) => {
  const { content } = req.body;
  const user = req.user; // Ahora se envía el objeto completo del usuario

  try {
    const message = await sendMessage(content, user);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * 📤 Controlador para obtener todos los mensajes.
 */
export const fetchMessages = async (req, res) => {
  const user = req.user; // Obtenemos el usuario autenticado

  try {
    // 1️⃣ Validar rol del usuario
    if (user.role !== "MODERATOR" && user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ error: "No tienes permisos para ver los mensajes." });
    }

    // 2️⃣ Obtener los mensajes si tiene permisos
    const messages = await getMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes." });
  }
};
