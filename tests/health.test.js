const request = require('supertest');
const app = require('../src/app');
const dbHandler = require('./helpers/db');

describe('Health and System Routes', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  test('GET /health should return 200 OK with status message', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Server is running');
    expect(res.body).toHaveProperty('timestamp');
  });

  test('GET /non-existent-route should return 404 Endpoint not found', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Endpoint not found');
  });
});
