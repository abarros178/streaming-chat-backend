import { Router } from 'express';
import { fetchMessages, postMessage } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

/**
 *  Obtener todos los mensajes del chat.
 * - Método: GET
 * - URL: /
 * - Middleware: authenticateToken (requiere autenticación)
 * - Controlador: fetchMessages (devuelve todos los mensajes)
 */
router.get('/', authenticateToken, fetchMessages);

/**
 *  Enviar un nuevo mensaje al chat.
 * - Método: POST
 * - URL: /
 * - Middleware: authenticateToken (requiere autenticación)
 * - Controlador: postMessage (crea y guarda el mensaje)
 */
router.post('/', authenticateToken, postMessage);

export default router;
