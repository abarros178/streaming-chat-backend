import request from 'supertest';
import { app } from '../../src/index.js'; 

describe('🔐 Pruebas de Autenticación', () => {
  test('✅ Registro exitoso', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      username: 'testuser',
      password: '123456',
      role: 'STUDENT',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente.');
  });

  test('🚫 Registro fallido por usuario existente', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      username: 'testuser', // Ya existe
      password: '123456',
      role: 'STUDENT',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'El nombre de usuario ya está en uso.');
  });
});
