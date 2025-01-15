import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

/**
 *  Ruta para registrar un nuevo usuario.
 * - Método: POST
 * - URL: /register
 * - Controlador: register (maneja la lógica de registro)
 */
router.post('/register', register);

/**
 *  Ruta para iniciar sesión.
 * - Método: POST
 * - URL: /login
 * - Controlador: login (maneja la lógica de autenticación)
 */
router.post('/login', login);

export default router;
