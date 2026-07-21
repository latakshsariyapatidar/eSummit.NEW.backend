const { Pass } = require('./pass.model');
const { PASS_STATUS } = require('./pass.constants');
/**
 * ---------------------------------------------------------------------
 * Private Helpers
 * ---------------------------------------------------------------------
 */

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
};

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  throw error;
};

/**
 * ---------------------------------------------------------------------
 * Get Pass by Pass ID
 * ---------------------------------------------------------------------
 */

const getPassById = async (passId) => {

  const pass = await Pass.findOne({
    passId,
  }).populate('order');

  if (!pass) {
    notFound('Pass not found.');
  }

  return pass;

};

/**
 * ---------------------------------------------------------------------
 * Get all passes belonging to an order.
 * ---------------------------------------------------------------------
 */

const getPassesByOrder = async (orderId) => {

  return Pass.find({
    orderId,
  }).sort({
    createdAt: 1,
  });

};

/**
 * ---------------------------------------------------------------------
 * Check-In Pass
 *
 * Future ready.
 * Can later be called from scanner application.
 * ---------------------------------------------------------------------
 */

const checkInPass = async ({
  passId,
  adminId,
}) => {

  const pass = await Pass.findOne({
    passId,
  });

  if (!pass) {
    notFound('Pass not found.');
  }

  if (pass.status === PASS_STATUS.CANCELLED) {
    badRequest('Pass has been cancelled.');
  }

  if (pass.checkedIn) {
    badRequest('Pass has already been checked in.');
  }

  pass.checkedIn = true;

  pass.checkedInAt = new Date();

  pass.checkedInBy = adminId;

  pass.status = PASS_STATUS.USED;

  await pass.save();

  return pass;

};

/**
 * ---------------------------------------------------------------------
 * Cancel Pass
 *
 * Optional utility.
 * Can later be used for refunds or admin operations.
 * ---------------------------------------------------------------------
 */

const cancelPass = async (passId) => {

  const pass = await Pass.findOne({
    passId,
  });

  if (!pass) {
    notFound('Pass not found.');
  }

  if (pass.status === PASS_STATUS.USED) {
    badRequest('Checked-in passes cannot be cancelled.');
  }

  pass.status = PASS_STATUS.CANCELLED;

  await pass.save();

  return pass;

};

module.exports = {

  getPassById,

  getPassesByOrder,

  checkInPass,

  cancelPass,

};