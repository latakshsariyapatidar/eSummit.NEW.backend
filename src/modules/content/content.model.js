/**
 * Content Model - E-Summit '26
 * 
 * Houses multiple lightweight schemas mapping static and landing page elements (FAQ, Sponsors, Events, Speakers).
 * 
 * Schemas to define:
 * 1. SpeakerSchema:
 *    - name, designation, organization, avatarUrl, bio, socialLinks (object).
 * 2. ScheduleSchema (Events):
 *    - title, description, speakerIds (array of ObjectId), startTime, endTime, venue, category ('keynote', 'panel', 'workshop').
 * 3. SponsorSchema:
 *    - companyName, logoUrl, tier ('title', 'platinum', 'gold', 'silver'), websiteUrl.
 * 4. FaqSchema:
 *    - question, answer, category ('registration', 'events', 'accommodation').
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// TODO: 1. Design SpeakerSchema
// TODO: 2. Design ScheduleSchema
// TODO: 3. Design SponsorSchema
// TODO: 4. Design FaqSchema
// TODO: 5. Export Mongoose models

module.exports = {
  Speaker: null,
  Schedule: null,
  Sponsor: null,
  FAQ: null,
};
