const request = require('supertest');
const app = require('../src/app');
const dbHandler = require('./helpers/db');
const env = require('../src/common/config/env');
const User = require('../src/modules/auth/auth.model');

describe('Auth Module Routes (/api/auth)', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('POST /api/auth/verify-key', () => {
    test('should reject request when key is missing', async () => {
      const res = await request(app).post('/api/auth/verify-key').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Access key is required');
    });

    test('should verify master admin key successfully', async () => {
      const res = await request(app)
        .post('/api/auth/verify-key')
        .send({ key: env.ADMIN_KEY });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.role).toBe('admin');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    test('should verify volunteer key created in database', async () => {
      const volunteerKey = new User({ key: 'VOL12345', role: 'volunteer' });
      await volunteerKey.save();

      const res = await request(app)
        .post('/api/auth/verify-key')
        .send({ key: 'VOL12345' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.role).toBe('volunteer');
    });

    test('should reject invalid key', async () => {
      const res = await request(app)
        .post('/api/auth/verify-key')
        .send({ key: 'INVALID_KEY' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Invalid access key');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should clear auth token cookie', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should return 401 when no token or cookie provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });

    test('should return user info when authenticated via token header', async () => {
      const loginRes = await request(app)
        .post('/api/auth/verify-key')
        .send({ key: env.ADMIN_KEY });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.role).toBe('admin');
    });
  });
});
