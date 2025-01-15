import { sendMessage, getMessages } from '../services/chatService.js';

/**
 * 📥 Controlador para enviar un mensaje.
 * - Valida el contenido.
 * - Llama al servicio para guardar el mensaje.
 */
export const postMessage = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const message = await sendMessage(content, userId);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * 📤 Controlador para obtener todos los mensajes.
 */
export const fetchMessages = async (req, res) => {
  try {
    const messages = await getMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes.' });
  }
};
