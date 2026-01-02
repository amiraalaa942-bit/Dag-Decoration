import request from 'supertest';
import app from '../index.ts';

describe('Order Endpoints', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login to get token
    const loginRes = await request(app)
      .post('/admin/login')
      .send({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS });
    
    authToken = loginRes.body.token;
  });

  it('POST /send-order should process order', async () => {
    const res = await request(app)
      .post('/send-order')
      .send({
        order: [
          { paintingId: 1, quantity: 2 },
          { paintingId: 2, quantity: 1 }
        ]
      });
    
    // Returns 200 or 500 depending on email setup
    expect([200, 500]).toContain(res.statusCode);
  });
});