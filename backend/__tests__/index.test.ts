import request from 'supertest';

import app from '../src/index';
import { connection } from '../config';
import mongoose from 'mongoose';

describe('Test app.ts', () => {
  test('Root route', async () => {
    const res = await request(app).get('/');
    expect(res.body).toEqual({ message: 'Hello World' });
  });
});

describe('Database Connection', () => {
  let dbConnection;

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('Should establish a connection to the database', async () => {
    try {
      dbConnection = await connection;
      expect(dbConnection).toBeTruthy();
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      expect(error).toBeNull();
    }
  });
});
