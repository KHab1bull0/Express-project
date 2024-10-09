import request from 'supertest';
import { app } from '../src/app.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let token;
let productId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  console.log('Connected to test database');

  const user = { _id: new mongoose.Types.ObjectId(), role: 'admin' };
  token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  console.log(token);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product API', () => {
  test('GET /api/products should return all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('POST /api/products should create a new product', async () => {
    const imagePath = path.join(__dirname, 'test-image.jpg');
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Product')
      .field('price', 999)
      .field('description', 'This is a test product')
      .attach('image', imagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Mahsulot muvaffaqiyatli qo'shildi");
    expect(res.body.product).toHaveProperty('_id');
    productId = res.body.product._id;
  });

  test('PUT /api/products/:id should update a product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Updated Test Product')
      .field('price', 19900);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Mahsulot muvaffaqiyatli yangilandi");
    expect(res.body.product.name).toBe('Updated Test Product');
  });

  test('DELETE /api/products/:id should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
