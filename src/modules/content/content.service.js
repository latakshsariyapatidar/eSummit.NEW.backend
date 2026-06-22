/**
 * Content Service - E-Summit '26
 * 
 * Logic managing dynamic website content assets (Speakers, Schedules, FAQs, and Sponsors).
 * Supports caching layers to optimize landing page performance.
 * 
 * Core responsibilities:
 * - fetchContent(type)       -> Reads database filtered by visibility status.
 * - insertContent(type, data)-> Validates payload structures and creates models.
 * - modifyContent(id, data)  -> Edits and updates specific fields.
 * - removeContent(id)        -> Deletes dynamic records.
 */

const { Event, Sponsor, FAQ, Schedule, Merch, Config, Team } = require('./content.model');
const logger = require('../../common/lib/logger');

const getEvents = async () => {
  return await Event.find({});
};

const getSponsors = async () => {
  return await Sponsor.find({});
};

const getFAQs = async () => {
  return await FAQ.find({});
};

const getSchedules = async () => {
  return await Schedule.find({});
};

const getMerch = async () => {
  return await Merch.find({});
};

const getConfig = async (key) => {
  return await Config.findOne({ key });
};

const getTeams = async () => {
  return await Team.find({});
};

module.exports = {
  getEvents,
  getSponsors,
  getFAQs,
  getSchedules,
  getMerch,
  getConfig,
  getTeams,
};
