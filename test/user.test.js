import request from 'supertest';
import { app } from '../src/app.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  console.log('Connected to test database');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  test('POST /api/users should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
        role: 'user'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
    expect(res.body.user).toHaveProperty('_id');
    userId = res.body.user._id;
  });

  test('POST /api/users/login should login a user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('GET /api/users should return all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('PUT /api/users/:id should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updatedtestuser'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi");
    expect(res.body.user.username).toBe('updatedtestuser');
  });

  test('DELETE /api/users/:id should delete a user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Foydalanuvchi muvaffaqiyatli o'chirildi");
  });
});
