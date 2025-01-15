import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware para autenticar tokens JWT.
 * - Verifica si el token está presente en el encabezado Authorization.
 * - Valida el token usando la clave secreta (JWT_SECRET).
 * - Si es válido, agrega la información del usuario a req.user y continúa.
 * - Si no hay token o es inválido, responde con error 401 o 403.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del encabezado

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' }); // No hay token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' }); // Token inválido
    }
    req.user = user; // Token válido, se almacena el usuario en req.user
    next(); // Continúa con la siguiente función
  });
};
