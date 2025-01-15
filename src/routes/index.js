import { Router } from 'express';
import authRoutes from './authRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = Router();

/**
 *  Rutas de autenticación.
 * - Prefijo: /auth
 * - Maneja: Registro e inicio de sesión.
 *   - POST /auth/register → Registrar usuario.
 *   - POST /auth/login → Iniciar sesión.
 */
router.use('/auth', authRoutes);

/**
 *  Rutas del chat.
 * - Prefijo: /chat
 * - Maneja: Mensajería (ver y enviar mensajes).
 *   - GET /chat → Obtener mensajes (requiere autenticación).
 *   - POST /chat → Enviar mensaje (requiere autenticación).
 */
router.use('/chat', chatRoutes);

export default router;
