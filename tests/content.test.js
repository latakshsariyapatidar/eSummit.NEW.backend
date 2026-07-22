const request = require('supertest');
const app = require('../src/app');
const dbHandler = require('./helpers/db');
const env = require('../src/common/config/env');
const { Status } = require('../src/modules/content/content.model');

describe('Content Module Routes (/api/content)', () => {
  let adminToken;

  beforeAll(async () => {
    await dbHandler.connect();

    const loginRes = await request(app)
      .post('/api/auth/verify-key')
      .send({ key: env.ADMIN_KEY });

    adminToken = loginRes.body.data.token;
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Public Content GET Endpoints', () => {
    test('GET /api/content/events - should return events content', async () => {
      const res = await request(app).get('/api/content/events');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });

    test('GET /api/content/sponsors - should return sponsors content', async () => {
      const res = await request(app).get('/api/content/sponsors');
      expect(res.statusCode).toBe(200);
    });

    test('GET /api/content/faqs - should return FAQs content', async () => {
      const res = await request(app).get('/api/content/faqs');
      expect(res.statusCode).toBe(200);
    });

    test('GET /api/content/schedule - should return schedule content', async () => {
      const res = await request(app).get('/api/content/schedule');
      expect(res.statusCode).toBe(200);
    });

    test('GET /api/content/teams - should return teams content', async () => {
      const res = await request(app).get('/api/content/teams');
      expect(res.statusCode).toBe(200);
    });

    test('GET /api/content/passes - should return passes content', async () => {
      const res = await request(app).get('/api/content/passes');
      expect(res.statusCode).toBe(200);
    });

    test('GET /api/content/:type/status - should return content status for valid type', async () => {
      const res = await request(app).get('/api/content/events/status');
      expect(res.statusCode).toBe(200);
      expect(typeof res.body.data).toBe('string');
    });

    test('GET /api/content/:type/status - should fail for invalid type', async () => {
      const res = await request(app).get('/api/content/invalid_type/status');
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Invalid content type');
    });
  });

  describe('Admin Content Updates', () => {
    test('PUT /api/content/:type/status - should update content status for admin', async () => {
      const res = await request(app)
        .put('/api/content/events/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-admin-key', env.ADMIN_KEY)
        .send({ status: 'yes' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.value).toBe('yes');
    });

    test('PUT /api/content/:type/status - should reject invalid status value', async () => {
      const res = await request(app)
        .put('/api/content/events/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-admin-key', env.ADMIN_KEY)
        .send({ status: 'invalid' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Status must be yes or no');
    });
  });
});
