const express = require('express');
const qrController = require('./qr.controller');

const router = express.Router();

// POST /payment  -> body: { cartPrice, orderId }
router.post('/payment', qrController.generatePaymentQr);

// POST /pass     -> body: { passId, orderId }
router.post('/pass', qrController.generatePassQr);

module.exports = router;