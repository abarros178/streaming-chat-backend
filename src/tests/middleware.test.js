import { authenticateToken } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

describe('🔒 Middleware: Autenticación de Token', () => {
  test('✅ Token válido permite acceso', () => {
    const req = { headers: { authorization: `Bearer ${jwt.sign({ id: 1 }, process.env.JWT_SECRET)}` } };
    const res = {};
    const next = jest.fn();

    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('🚫 Sin token devuelve 401', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
