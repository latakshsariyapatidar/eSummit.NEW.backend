/**
 * Passes Routes - E-Summit '26
 * 
 * Defines routing endpoints for listing, generating, and updating ticket passes and checking ticket inventory availability.
 * 
 * Endpoints to be defined:
 * - GET  /api/passes/inventory       -> Public check of tickets left in each tier.
 * - GET  /api/passes/:id             -> Retrieve information about a specific pass (validity, buyer name).
 * - POST /api/passes/bulk-generate   -> Admin utility to generate physical tickets or test credentials.
 * - PATCH /api/passes/:id/revoke     -> Admin revokes a ticket pass.
 */

const express = require('express');
const router = express.Router();
const passesController = require('./passes.controller');
const { protect, requireAdmin } = require('../auth/auth.middleware');

// TODO: 1. Setup public inventory endpoints
// TODO: 2. Setup protected pass details lookup (protect / volunteer/admin only)
// TODO: 3. Setup admin-only management paths (bulk-generate, revoke)

module.exports = router;
