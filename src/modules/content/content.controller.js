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

const getTeams = asyncHandler(async (req, res) => {
  const teams = await contentService.getTeams();
  return apiResponse.success(res, teams);
});

const getPasses = asyncHandler(async (req, res) => {
  const passes = await contentService.getPasses();
  return apiResponse.success(res, passes);
});

module.exports = {
  getEvents,
  getSponsors,
  getFAQs,
  getSchedules,
  getTeams,
  getPasses,
};
