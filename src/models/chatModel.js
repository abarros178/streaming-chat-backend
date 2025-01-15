import prisma from '../config/db.js';

/**
 *  Crea un nuevo mensaje en la base de datos.
 * 
 * @param {string} content - Contenido del mensaje.
 * @param {number} userId - ID del usuario que envía el mensaje.
 * @returns {Promise<Object>} - Mensaje creado.
 */
export const createChatMessage = async (content, userId) => {
  return prisma.message.create({
    data: { content, userId },
    include: {
      user: { select: { name: true, role: true } }
    }
  });
};

/**
 *  Obtiene todos los mensajes del chat.
 * 
 * @returns {Promise<Array>} - Lista de mensajes con información del usuario.
 */
export const getAllChatMessages = async () => {
  return prisma.message.findMany({
    include: {
      user: { select: { name: true, role: true } }
    },
    orderBy: { createdAt: 'asc' }
  });
};
