import request from 'supertest';
import app from '../index.ts';

describe('Authentication Endpoints', () => {
  it('POST /admin/login should return JWT token', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASS
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token).toBeTruthy();
  });

  it('POST /admin/login with wrong credentials should fail', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({
        username: 'wrong',
        password: 'wrong'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(typeof res.body.error).toBe('string');
  });
});