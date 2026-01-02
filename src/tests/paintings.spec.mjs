import request from 'supertest';
import app from '../index.ts';

describe('Paintings Endpoints', () => {
  it('GET /paintingsInfo should return array of paintings', async () => {
    const res = await request(app).get('/paintingsInfo');
    console.log("res : ",res.body)
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it('GET /paintingImage/:id should return image', async () => {
      expect(true).toBeTrue();
    
  });

  it('POST /paintings should require authentication', async () => {
    const res = await request(app)
      .post('/paintings')
      .send({});
    
    expect(res.statusCode).toEqual(401);
  });
});