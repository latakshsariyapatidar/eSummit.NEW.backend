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

const EventSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String },
  day: { type: String },
  time: { type: String },
  about: { type: String },
  brief: { type: String },
  format: { type: [String] },
});

const SponsorSchema = new Schema({
  name: { type: String, required: true },
  tier: { type: String, required: true },
  logoType: { type: String },
});

const FAQSchema = new Schema({
  q: { type: String, required: true },
  a: { type: String, required: true },
});

const ScheduleSchema = new Schema({
  day: { type: String, required: true },
  items: [{
    time: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String },
    location: { type: String },
  }],
});

const MerchSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String },
});

const ConfigSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed },
});

const TeamSchema = new Schema({
  lead: {
    name: { type: String },
    role: { type: String },
    team: { type: String },
    email: { type: String },
    bio: { type: String },
    image: { type: String },
    event: { type: String },
  },
  crew: [{
    name: { type: String },
    image: { type: String },
  }],
});

module.exports = {
  Event: mongoose.model('Event', EventSchema, 'events'),
  Sponsor: mongoose.model('Sponsor', SponsorSchema, 'sponsors'),
  FAQ: mongoose.model('FAQ', FAQSchema, 'faqs'),
  Schedule: mongoose.model('Schedule', ScheduleSchema, 'schedules'),
  Merch: mongoose.model('Merch', MerchSchema, 'merch'),
  Config: mongoose.model('Config', ConfigSchema, 'configs'),
  Team: mongoose.model('Team', TeamSchema, 'teams'),
};
