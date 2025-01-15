import { registerUser, loginUser } from '../services/authService.js';

/**
 * Registra un nuevo usuario.
 * - Recibe: name, username, password, role.
 * - Responde: 201 si el registro es exitoso, 409 si el usuario ya existe, 400 para otros errores.
 */
export const register = async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const user = await registerUser({ name, username, password, role });
    res.status(201).json({ message: 'Usuario registrado exitosamente.', user });
  } catch (error) {
    console.error('Error en el registro:', error.message);

    if (error.message.includes('ya está en uso')) {
      return res.status(409).json({ error: error.message });
    }

    res.status(400).json({ error: error.message });
  }
};

/**
 * Inicia sesión de usuario.
 * - Recibe: username, password.
 * - Responde: 200 con token si es exitoso, 401 si falla.
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await loginUser(username, password);
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el login:', error.message);
    res.status(401).json({ error: error.message });
  }
};
