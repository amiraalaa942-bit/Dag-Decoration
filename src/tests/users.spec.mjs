import request from 'supertest';
import app from '../index.ts';

describe('Users Endpoints', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login to get token
    const loginRes = await request(app)
      .post('/admin/login')
      .send({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS  });
    
    authToken = loginRes.body.token;
  });

  it('GET /users should require authentication', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(401);
  });

  it('GET /users with token should return users array', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);
    console.log("user res :",res.body)
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it('GET /users/:id should return specific user', async () => {
    // First get users to find an ID
    const usersRes = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);
    
    if (usersRes.body.length > 0) {
      const userId = usersRes.body[0].id;
      const res = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(userId);
    }
  });

  it('POST /users should create new user', async () => {
    const randomUsername = `testuser_${Date.now()}`;
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: randomUsername,
        password: '$2b$10$5/GkOUabBx5iTsadXU/Ju.A2oKCKA6kNNSYbnRvd/GZTkDl7VAUyG',
        first_name: 'user',
        last_name: ''
      });
    console.log("post user :",res.body, " random user:",res.body.username)
    // Should return 201 Created or 200 OK
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.username).toEqual(randomUsername);
  });
});

