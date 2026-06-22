/**
 * Check-in Routes - E-Summit '26
 * 
 * Defines routing endpoints for gate check-ins and attendee status checks at entry gates.
 * 
 * Endpoints to be defined:
 * - POST /api/checkin/scan           -> Scan a ticket pass. Validates pass ID, logs check-in event, and grants/denies access.
 * - GET  /api/checkin/stats          -> Retrieve live analytics (total scans, scans per gate, peak times).
 * - GET  /api/checkin/history        -> Retrieve historical logs of scanned passes.
 */

const express = require('express');
const router = express.Router();
const checkinController = require('./checkin.controller');
const { protect, requireVolunteer } = require('../auth/auth.middleware');

// TODO: Setup attendance entry-gate endpoints:
// - POST /verify-qr -> verifyQr handler
// - POST /mark -> markAttendance handler

router.post('/verify-qr', checkinController.verifyQr);
router.post('/mark', checkinController.markAttendance);

module.exports = router;
