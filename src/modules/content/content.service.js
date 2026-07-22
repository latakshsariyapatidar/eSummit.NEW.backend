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

const { Event, Sponsor, FAQ, Schedule, Merch, Config, Team, PassesCategory} = require('./content.model');
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

const getPasses = async () => {
  return await PassesCategory.find({});
};

const updatePassStatus = async (id, soldOut) => {
  return await PassesCategory.findOneAndUpdate({ id }, { soldOut }, { new: true });
};

const getContentStatus = async (type) => {
  const config = await Config.findOne({ key: `status_${type}` });
  return config ? config.value : 'yes';
};

const updateContentStatus = async (type, status) => {
  return await Config.findOneAndUpdate(
    { key: `status_${type}` },
    { value: status },
    { upsert: true, new: true },
  );
};

module.exports = {
  getEvents,
  getSponsors,
  getFAQs,
  getSchedules,
  getMerch,
  getConfig,
  getTeams,
  getPasses,
  updatePassStatus,
  getContentStatus,
  updateContentStatus,
};
