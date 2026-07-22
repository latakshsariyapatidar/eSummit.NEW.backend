const request = require('supertest');
const app = require('../src/app');
const dbHandler = require('./helpers/db');
const env = require('../src/common/config/env');
const User = require('../src/modules/auth/auth.model');

describe('Admin Module Routes (/api/admin)', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Authorization checks for /api/admin/keys', () => {
    test('should reject request when X-Admin-Key header is missing', async () => {
      const res = await request(app).get('/api/admin/keys');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Admin key is missing');
    });

    test('should reject request when X-Admin-Key is invalid', async () => {
      const res = await request(app)
        .get('/api/admin/keys')
        .set('x-admin-key', 'wrongkey');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toContain('Invalid Admin Key');
    });
  });

  describe('Key Management Endpoints', () => {
    test('POST /api/admin/keys - should generate volunteer key', async () => {
      const res = await request(app)
        .post('/api/admin/keys')
        .set('x-admin-key', env.ADMIN_KEY);

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('key');
      expect(res.body.data.role).toBe('volunteer');
    });

    test('GET /api/admin/keys - should list generated keys', async () => {
      await request(app)
        .post('/api/admin/keys')
        .set('x-admin-key', env.ADMIN_KEY);

      const res = await request(app)
        .get('/api/admin/keys')
        .set('x-admin-key', env.ADMIN_KEY);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    test('DELETE /api/admin/keys/:id - should delete a key by id', async () => {
      const keyDoc = new User({ key: 'TESTKEY1', role: 'volunteer' });
      await keyDoc.save();

      const res = await request(app)
        .delete(`/api/admin/keys/${keyDoc._id}`)
        .set('x-admin-key', env.ADMIN_KEY);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Key revoked successfully');

      const checkDoc = await User.findById(keyDoc._id);
      expect(checkDoc).toBeNull();
    });

    test('DELETE /api/admin/keys/:id - should return 404 for unknown key id', async () => {
      const fakeId = '65ab9b08f87c5304b4c8a2c2';
      const res = await request(app)
        .delete(`/api/admin/keys/${fakeId}`)
        .set('x-admin-key', env.ADMIN_KEY);

      expect(res.statusCode).toBe(404);
    });
  });
});
