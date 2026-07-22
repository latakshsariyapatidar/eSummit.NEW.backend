const request = require('supertest');
const app = require('../src/app');
const dbHandler = require('./helpers/db');
const env = require('../src/common/config/env');
const Order = require('../src/modules/orders/orders.model');

describe('Orders Module Routes (/api/orders)', () => {
  let adminToken;

  beforeAll(async () => {
    await dbHandler.connect();

    // Authenticate admin to get token
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

  describe('POST /api/orders/submit', () => {
    test('should create order successfully when payload is valid with eventName', async () => {
      const payload = {
        cartValue: 750,
        passes: [
          {
            eventName: 'E-Summit Hackathon 2026',
            passType: 'Day 1 Pass',
            passPrice: 750,
            attendeeName: 'Test Attendee',
            attendeeEmail: 'attendee@example.com',
            attendeeGender: 'Male',
            collegeName: 'IIT Dharwad',
          },
        ],
      };

      const res = await request(app).post('/api/orders/submit').send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('orderId');
      expect(res.body.data).toHaveProperty('qrBase64');
      expect(res.body.data).toHaveProperty('paymentUPI');

      const savedOrder = await Order.findOne({ orderId: res.body.data.orderId });
      expect(savedOrder).toBeDefined();
      expect(savedOrder.passRequests[0].eventName).toBe('E-Summit Hackathon 2026');
    });

    test('should fail when cartValue does not match sum of passPrice', async () => {
      const payload = {
        cartValue: 1000,
        passes: [
          {
            eventName: 'E-Summit Hackathon 2026',
            passType: 'Day 1 Pass',
            passPrice: 750,
            attendeeName: 'Test Attendee',
            attendeeEmail: 'attendee@example.com',
            attendeeGender: 'Male',
            collegeName: 'IIT Dharwad',
          },
        ],
      };

      const res = await request(app).post('/api/orders/submit').send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Cart value mismatch');
    });

    test('should fail when eventName is missing', async () => {
      const payload = {
        cartValue: 750,
        passes: [
          {
            passType: 'Day 1 Pass',
            passPrice: 750,
            attendeeName: 'Test Attendee',
            attendeeEmail: 'attendee@example.com',
            attendeeGender: 'Male',
            collegeName: 'IIT Dharwad',
          },
        ],
      };

      const res = await request(app).post('/api/orders/submit').send(payload);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/orders/utr', () => {
    test('should submit UTR for valid pending order', async () => {
      const createRes = await request(app).post('/api/orders/submit').send({
        cartValue: 500,
        passes: [
          {
            eventName: 'Pitching 101',
            passType: 'Standard',
            passPrice: 500,
            attendeeName: 'Alice',
            attendeeEmail: 'alice@example.com',
            attendeeGender: 'Female',
            collegeName: 'NIT Surathkal',
          },
        ],
      });

      const { orderId } = createRes.body.data;

      const utrRes = await request(app).post('/api/orders/utr').send({
        orderId,
        utr: 'UTR1234567890',
      });

      expect(utrRes.statusCode).toBe(200);
      expect(utrRes.body.data.status).toBe('payment_submitted');
    });

    test('should reject duplicate UTR submission', async () => {
      const o1 = await request(app).post('/api/orders/submit').send({
        cartValue: 500,
        passes: [{ eventName: 'E1', passType: 'P1', passPrice: 500, attendeeName: 'A1', attendeeEmail: 'a1@test.com', attendeeGender: 'Male', collegeName: 'C1' }],
      });
      const o2 = await request(app).post('/api/orders/submit').send({
        cartValue: 500,
        passes: [{ eventName: 'E2', passType: 'P2', passPrice: 500, attendeeName: 'A2', attendeeEmail: 'a2@test.com', attendeeGender: 'Female', collegeName: 'C2' }],
      });

      await request(app).post('/api/orders/utr').send({ orderId: o1.body.data.orderId, utr: 'DUPLICATEUTR123' });
      const dupRes = await request(app).post('/api/orders/utr').send({ orderId: o2.body.data.orderId, utr: 'DUPLICATEUTR123' });

      expect(dupRes.statusCode).toBe(400);
      expect(dupRes.body.message).toContain('UTR has already been used');
    });
  });

  describe('Admin Order Management Routes', () => {
    let testOrderId;

    beforeEach(async () => {
      const createRes = await request(app).post('/api/orders/submit').send({
        cartValue: 500,
        passes: [
          {
            eventName: 'Keynote Talk',
            passType: 'Gold',
            passPrice: 500,
            attendeeName: 'Bob',
            attendeeEmail: 'bob@example.com',
            attendeeGender: 'Male',
            collegeName: 'IIT Bombay',
          },
        ],
      });
      testOrderId = createRes.body.data.orderId;

      await request(app).post('/api/orders/utr').send({
        orderId: testOrderId,
        utr: 'UTR9999888877',
      });
    });

    test('GET /api/orders/admin/pending - should list pending orders for admin', async () => {
      const res = await request(app)
        .get('/api/orders/admin/pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-admin-key', env.ADMIN_KEY);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    test('GET /api/orders/admin/:orderId - should fetch order details', async () => {
      const res = await request(app)
        .get(`/api/orders/admin/${testOrderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-admin-key', env.ADMIN_KEY);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.orderId).toBe(testOrderId);
    });

    test('POST /api/orders/admin/:orderId/approve - should approve order and generate passes with eventName', async () => {
      const res = await request(app)
        .post(`/api/orders/admin/${testOrderId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-admin-key', env.ADMIN_KEY);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('verified');
      expect(res.body.data.passes.length).toBe(1);
    });

    test('POST /api/orders/admin/:orderId/reject - should reject order with reason', async () => {
      const res = await request(app)
        .post(`/api/orders/admin/${testOrderId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-admin-key', env.ADMIN_KEY)
        .send({ reason: 'Invalid payment screenshot provided' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('rejected');
    });
  });
});
