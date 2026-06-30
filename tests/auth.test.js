/**
 * Authentication Integration Tests - E-Summit '26
 * 
 * Target endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/register-volunteer
 * - GET /api/auth/me
 * 
 * Test Scenarios to implement:
 * 1. Admin login with correct credentials should issue valid JWT token cookie.
 * 2. Unauthenticated request to /api/auth/me should reject with 401 Unauthorized.
 * 3. Volunteer role trying to access register-volunteer should reject with 403 Forbidden.
 * 4. Regular login with wrong credentials should reject with 400/401.
 */

const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/modules/auth/auth.model');
const env = require('../src/common/config/env');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe('Auth Endpoints & Key-Based System', () => {
  
  test('POST /api/auth/verify-key - should authenticate admin and set cookie', async () => {
    const res = await request(app)
      .post('/api/auth/verify-key')
      .send({ key: env.ADMIN_KEY });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.role).toBe('admin');
    expect(res.body.data.token).toBeDefined();

    // Check if cookie is set
    const cookies = res.headers['set-cookie'] || [];
    expect(cookies.some(cookie => cookie.includes('token='))).toBe(true);
  });

  test('POST /api/auth/verify-key - should reject invalid key', async () => {
    const res = await request(app)
      .post('/api/auth/verify-key')
      .send({ key: 'invalidkey123' });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Invalid access key');
  });

  test('GET /api/auth/me - should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me - should return admin info for authenticated admin', async () => {
    const loginRes = await request(app)
      .post('/api/auth/verify-key')
      .send({ key: env.ADMIN_KEY });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('admin');
    expect(res.body.data.ID).toBe(0);
  });

  test('POST /api/admin/keys - should allow admin to generate volunteer keys', async () => {
    const res = await request(app)
      .post('/api/admin/keys')
      .set('X-Admin-Key', env.ADMIN_KEY)
      .send({ description: 'Gate 1 Scanner' });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.key).toBeDefined();
    expect(res.body.data.key.length).toBe(8);
    expect(res.body.data.role).toBe('volunteer');
  });

  test('POST /api/admin/keys - should block requests missing or having invalid X-Admin-Key', async () => {
    const res = await request(app)
      .post('/api/admin/keys')
      .send({ description: 'Gate 1 Scanner' });

    expect(res.status).toBe(401);

    const res2 = await request(app)
      .post('/api/admin/keys')
      .set('X-Admin-Key', 'wrong-key')
      .send({ description: 'Gate 1 Scanner' });

    expect(res2.status).toBe(403);
  });

  test('POST /api/auth/verify-key - should authenticate volunteer with generated key', async () => {
    // 1. Generate key
    const genRes = await request(app)
      .post('/api/admin/keys')
      .set('X-Admin-Key', env.ADMIN_KEY)
      .send({ description: 'Gate 2 Scanner' });

    const volKey = genRes.body.data.key;

    // 2. Authenticate
    const loginRes = await request(app)
      .post('/api/auth/verify-key')
      .send({ key: volKey });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.role).toBe('volunteer');
    expect(loginRes.body.data.token).toBeDefined();
  });

  test('GET /api/admin/keys - should list volunteer keys', async () => {
    // Generate key first
    await request(app)
      .post('/api/admin/keys')
      .set('X-Admin-Key', env.ADMIN_KEY)
      .send({ description: 'Gate 3 Scanner' });

    const listRes = await request(app)
      .get('/api/admin/keys')
      .set('X-Admin-Key', env.ADMIN_KEY);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toBeInstanceOf(Array);
    expect(listRes.body.data.length).toBe(1);
    expect(listRes.body.data[0].role).toBe('volunteer');
  });

  test('DELETE /api/admin/keys/:id - should delete/revoke a key', async () => {
    // 1. Generate key
    const genRes = await request(app)
      .post('/api/admin/keys')
      .set('X-Admin-Key', env.ADMIN_KEY)
      .send({ description: 'Temp Key' });

    const keyId = genRes.body.data._id;
    const keyVal = genRes.body.data.key;

    // 2. Delete key
    const delRes = await request(app)
      .delete(`/api/admin/keys/${keyId}`)
      .set('X-Admin-Key', env.ADMIN_KEY);

    expect(delRes.status).toBe(200);

    // 3. Try to authenticate with the deleted key -> should fail
    const loginRes = await request(app)
      .post('/api/auth/verify-key')
      .send({ key: keyVal });

    expect(loginRes.status).toBe(401);
  });
});
