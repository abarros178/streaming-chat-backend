import { createChatMessage, getAllChatMessages } from "../models/chatModel.js";

/**
 *  Servicio para crear un mensaje.
 *
 * @param {string} content - Contenido del mensaje.
 * @param {Object} user - Objeto del usuario autenticado (incluye id y rol).
 * @returns {Promise<Object>} - Mensaje creado.
 */
export const sendMessage = async (content, user) => {
  if (!content || content.trim() === "") {
    throw new Error("El mensaje no puede estar vacío.");
  }

  if (content.length > 80) {
    throw new Error("El mensaje no puede tener más de 80 caracteres.");
  }
  if (user.role !== "MODERATOR" && user.role !== "STUDENT") {
    throw new Error("No tienes permisos para enviar mensajes.");
  }

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
