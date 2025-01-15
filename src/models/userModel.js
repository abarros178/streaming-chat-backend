import prisma from '../config/db.js';

/**
 *  Busca un usuario por su nombre de usuario.
 * - Recibe: username.
 * - Devuelve: el usuario si existe, o null si no se encuentra.
 *
 * @param {string} username - Nombre de usuario a buscar.
 * @returns {Promise<Object|null>} Usuario encontrado o null.
 */
export const findUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

/**
 *  Crea un nuevo usuario.
 * - Recibe: datos del usuario (name, username, password, role, etc.).
 * - Devuelve: el usuario creado.
 *
 * @param {Object} data - Información del nuevo usuario.
 * @returns {Promise<Object>} Usuario creado.
 */
export const createUser = async (data) => {
  return await prisma.user.create({
    data
  });
};

/**
 *  Busca un usuario por su ID.
 * - Recibe: ID del usuario.
 * - Devuelve: el usuario si existe, o null si no se encuentra.
 *
 * @param {number} id - ID del usuario.
 * @returns {Promise<Object|null>} Usuario encontrado o null.
 */
export const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};
