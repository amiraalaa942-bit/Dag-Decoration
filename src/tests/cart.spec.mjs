import request from 'supertest';
import app from '../index.ts';

describe('Cart Endpoints', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login to get token
    const loginRes = await request(app)
      .post('/admin/login')
      .send({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS });
    
    authToken = loginRes.body.token;
  });


  it('POST /cart/add should require authentication', async () => {
    const res = await request(app)
      .post('/cart/add')
      .send({ paintingId: 1 });
    
    expect(res.statusCode).toEqual(401);
  });
});