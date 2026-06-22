/**
 * Content Controller - E-Summit '26
 * 
 * Maps public page requests and administrative updates to Content Service logic.
 * 
 * Logic to be implemented:
 * - getContentList()   -> Matches type query (FAQ, Sponsor, Event) and returns active elements.
 * - createContent()    -> Admin creation logic for speakers, events, etc.
 * - updateContent()    -> Admin modify properties (e.g. updating speaker talk time).
 * - deleteContent()    -> Admin soft/hard delete of records.
 */

const contentService = require('./content.service');
const apiResponse = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');

const getEvents = asyncHandler(async (req, res) => {
  const events = await contentService.getEvents();
  return apiResponse.success(res, events);
});

const getSponsors = asyncHandler(async (req, res) => {
  const sponsors = await contentService.getSponsors();
  return apiResponse.success(res, sponsors);
});

const getFAQs = asyncHandler(async (req, res) => {
  const faqs = await contentService.getFAQs();
  return apiResponse.success(res, faqs);
});

const getSchedules = asyncHandler(async (req, res) => {
  const schedules = await contentService.getSchedules();
  return apiResponse.success(res, schedules);
});

const getMerch = asyncHandler(async (req, res) => {
  const merch = await contentService.getMerch();
  return apiResponse.success(res, merch);
});

const getTeams = asyncHandler(async (req, res) => {
  const teams = await contentService.getTeams();
  return apiResponse.success(res, teams);
});

const getConfig = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const config = await contentService.getConfig(key);
  if (!config) {
    return apiResponse.error(res, `Config key ${key} not found`, 404);
  }
  return apiResponse.success(res, config.value);
});

module.exports = {
  getEvents,
  getSponsors,
  getFAQs,
  getSchedules,
  getMerch,
  getTeams,
  getConfig,
};
