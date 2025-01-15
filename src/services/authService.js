import bcrypt from 'bcrypt';
import { findUserByUsername, createUser } from '../models/userModel.js';
import { Role } from '../utils/roleEnum.js';
import jwt from 'jsonwebtoken';

/**
 * Registro de un nuevo usuario.
 * - Valida los datos ingresados.
 * - Verifica si el usuario ya existe.
 * - Hashea la contraseña.
 * - Crea el usuario en la base de datos.
 *
 * @param {Object} userData - Datos del usuario (name, username, password, role).
 * @returns {Promise<Object>} Usuario creado.
 * @throws {Error} Si falta algún dato, el rol es inválido o el usuario ya existe.
 */
export const registerUser = async ({ name, username, password, role }) => {
  if (!name || !username || !password || !role) {
    throw new Error('Todos los campos son obligatorios.');
  }

  if (!Object.values(Role).includes(role)) {
    throw new Error('Rol inválido. Debe ser STUDENT, MODERATOR o GUEST.');
  }

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error('El nombre de usuario ya está en uso.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createUser({
    name,
    username,
    password: hashedPassword,
    role
  });
};

/**
 *  Autenticación de usuario (Inicio de sesión).
 * - Verifica si el usuario existe.
 * - Compara la contraseña ingresada con la almacenada.
 * - Genera un token JWT si las credenciales son correctas.
 *
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña.
 * @returns {Promise<Object>} Token JWT y datos del usuario.
 * @throws {Error} Si las credenciales son inválidas.
 */
export const loginUser = async (username, password) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error('Credenciales inválidas.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas.');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },  
    process.env.JWT_SECRET,            
    { expiresIn: '1h' }                
  );

  return { token, user };
};
