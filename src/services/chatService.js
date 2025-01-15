import { createChatMessage, getAllChatMessages } from '../models/chatModel.js';

/**
 *  Servicio para crear un mensaje.
 * 
 * @param {string} content - Contenido del mensaje.
 * @param {number} userId - ID del usuario autenticado.
 * @returns {Promise<Object>} - Mensaje creado.
 */
export const sendMessage = async (content, userId) => {
  if (!content || content.trim() === '') {
    throw new Error('El mensaje no puede estar vacío.');
  }

  if (content.length > 80) {
    throw new Error('El mensaje no puede tener más de 80 caracteres.');
  }

  return await createChatMessage(content, userId);
};

/**
 *  Servicio para obtener todos los mensajes del chat.
 * 
 * @returns {Promise<Array>} - Lista de mensajes.
 */
export const getMessages = async () => {
  return await getAllChatMessages();
};
