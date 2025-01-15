import { createChatMessage, getAllChatMessages } from "../models/chatModel.js";

/**
 * 🚀 Servicio para crear un mensaje.
 *
 * @param {string} content - Contenido del mensaje.
 * @param {Object} user - Objeto del usuario autenticado (incluye id y rol).
 * @returns {Promise<Object>} - Mensaje creado.
 */
export const sendMessage = async (content, user) => {
  // 1️⃣ Validar que el contenido no esté vacío
  if (!content || content.trim() === "") {
    throw new Error("El mensaje no puede estar vacío.");
  }

  // 2️⃣ Validar longitud máxima del mensaje
  if (content.length > 80) {
    throw new Error("El mensaje no puede tener más de 80 caracteres.");
  }
  // 3️⃣ Validar rol del usuario
  if (user.role !== "MODERATOR" && user.role !== "STUDENT") {
    throw new Error("No tienes permisos para enviar mensajes.");
  }

  // 4️⃣ Crear el mensaje si pasa todas las validaciones
  return await createChatMessage(content, user.id);
};

/**
 *  Servicio para obtener todos los mensajes del chat.
 *
 * @returns {Promise<Array>} - Lista de mensajes.
 */
export const getMessages = async () => {
  return await getAllChatMessages();
};
