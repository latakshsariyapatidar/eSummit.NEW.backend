const request = require('supertest');
const app = require('../src/app');
const dbHandler = require('./helpers/db');
const env = require('../src/common/config/env');
const { Pass, PASS_STATUS } = require('../src/modules/passes/pass.model');
const Order = require('../src/modules/orders/orders.model');

describe('Passes Module Routes (/api/passes)', () => {
  let adminToken;
  let testPass;

  beforeAll(async () => {
    await dbHandler.connect();

    // Authenticate admin to get token
    const loginRes = await request(app)
      .post('/api/auth/verify-key')
      .send({ key: env.ADMIN_KEY });

    adminToken = loginRes.body.data.token;
  });

  beforeEach(async () => {
    const orderDoc = new Order({
      orderId: 'ORD-TEST-PASS',
      amount: 500,
      expiresAt: new Date(Date.now() + 300000),
      passRequests: [
        {
          eventName: 'Startup Expo 2026',
          passType: 'Expo Pass',
          passPrice: 500,
          attendeeName: 'Charlie',
          attendeeEmail: 'charlie@example.com',
          attendeeGender: 'Male',
          collegeName: 'IIT Delhi',
        },
      ],
    });
    await orderDoc.save();

    testPass = new Pass({
      passId: 'PAS-TEST-001',
      orderId: orderDoc.orderId,
      order: orderDoc._id,
      eventName: 'Startup Expo 2026',
      type: 'Expo Pass',
      price: 500,
      attendeeName: 'Charlie',
      attendeeEmail: 'charlie@example.com',
      attendeeGender: 'Male',
      collegeName: 'IIT Delhi',
      qr: 'data:image/png;base64,fakeqr',
      status: PASS_STATUS.ACTIVE,
      checkedIn: false,
    });
    await testPass.save();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('GET /api/passes/:passId', () => {
    test('should fetch pass by passId', async () => {
      const res = await request(app).get(`/api/passes/${testPass.passId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.passId).toBe(testPass.passId);
      expect(res.body.data.eventName).toBe('Startup Expo 2026');
    });

    test('should return 404 for non-existent passId', async () => {
      const res = await request(app).get('/api/passes/INVALID-PASS-ID');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toContain('Pass not found');
    });
  });

  describe('GET /api/passes/order/:orderId', () => {
    test('should fetch passes belonging to orderId', async () => {
      const res = await request(app).get(`/api/passes/order/${testPass.orderId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('POST /api/passes/:passId/check-in', () => {
    test('should check-in pass successfully for authenticated volunteer/admin', async () => {
      const res = await request(app)
        .post(`/api/passes/${testPass.passId}/check-in`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.checkedIn).toBe(true);
      expect(res.body.data.status).toBe(PASS_STATUS.USED);
    });

    test('should reject second check-in attempt on already checked-in pass', async () => {
      await request(app)
        .post(`/api/passes/${testPass.passId}/check-in`)
        .set('Authorization', `Bearer ${adminToken}`);

      const res = await request(app)
        .post(`/api/passes/${testPass.passId}/check-in`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Pass has already been checked in');
    });

    test('should reject check-in without authentication', async () => {
      const res = await request(app).post(`/api/passes/${testPass.passId}/check-in`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/passes/:passId/cancel', () => {
    test('should cancel an active pass', async () => {
      const res = await request(app)
        .post(`/api/passes/${testPass.passId}/cancel`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe(PASS_STATUS.CANCELLED);
    });
  });
});
