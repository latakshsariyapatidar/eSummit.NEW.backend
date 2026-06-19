/**
 * Content Routes - E-Summit '26
 * 
 * Defines routing endpoints for dynamic page content such as schedules, speaker bios, and sponsor details.
 * 
 * Endpoints to be defined:
 * - GET  /api/content/events         -> Retrieve E-Summit schedule/events list (public).
 * - GET  /api/content/sponsors       -> Retrieve active sponsors metadata.
 * - GET  /api/content/faqs           -> Retrieve FAQ list.
 * - POST /api/content/:type          -> Admin create a new item (Speaker, Event, Sponsor, FAQ).
 * - PUT  /api/content/:type/:id      -> Admin update an existing CMS item.
 * - DELETE /api/content/:type/:id    -> Admin remove an item.
 */

const express = require('express');
const router = express.Router();
const contentController = require('./content.controller');
const { protect, requireAdmin } = require('../auth/auth.middleware');

// TODO: 1. Setup public fetch content endpoints (events, sponsors, faqs)
// TODO: 2. Setup administrative mutation endpoints (protect, requireAdmin)

module.exports = router;
