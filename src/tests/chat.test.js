import request from 'supertest';
import { app } from '../../src/index.js'; 

describe('💬 Pruebas de Mensajes', () => {
  let token;

  beforeAll(async () => {
    // Registrar y obtener token
    await request(app).post('/api/auth/register').send({
      name: 'User Test',
      username: 'usertest',
      password: 'password',
      role: 'STUDENT',
    });

    const res = await request(app).post('/api/auth/login').send({
      username: 'usertest',
      password: 'password',
    });

    token = res.body.token;
  });

  test('✅ Crear mensaje', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hola mundo' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('content', 'Hola mundo');
  });

  test('🚫 No permite mensaje vacío', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
