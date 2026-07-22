const asyncHandler = require('../../common/utils/asyncHandler');
const apiResponse = require('../../common/utils/apiResponse');

const passService = require('./pass.service');

/**
 * ---------------------------------------------------------------------
 * Get Pass By Pass ID
 * GET /passes/:passId
 * ---------------------------------------------------------------------
 */
const getPassById = asyncHandler(async (req, res) => {

  const { passId } = req.params;

  const pass = await passService.getPassById(passId);

  return apiResponse.success(
    res,
    pass,
    'Pass fetched successfully.',
  );

});

/**
 * ---------------------------------------------------------------------
 * Get All Passes By Order
 * GET /passes/order/:orderId
 * ---------------------------------------------------------------------
 */
const getPassesByOrder = asyncHandler(async (req, res) => {

  const { orderId } = req.params;

  const passes = await passService.getPassesByOrder(orderId);

  return apiResponse.success(
    res,
    passes,
    'Passes fetched successfully.',
  );

});

/**
 * ---------------------------------------------------------------------
 * Check-In Pass
 * POST /passes/:passId/check-in
 * ---------------------------------------------------------------------
 */
const checkInPass = asyncHandler(async (req, res) => {

  const { passId } = req.params;

  const result = await passService.checkInPass({
    passId,
    adminId: req.user.id,
  });

  return apiResponse.success(
    res,
    result,
    'Pass checked in successfully.',
  );

});

/**
 * ---------------------------------------------------------------------
 * Cancel Pass
 * POST /passes/:passId/cancel
 * ---------------------------------------------------------------------
 */
const cancelPass = asyncHandler(async (req, res) => {

  const { passId } = req.params;

  const result = await passService.cancelPass(passId);

  return apiResponse.success(
    res,
    result,
    'Pass cancelled successfully.',
  );

});

module.exports = {
  getPassById,
  getPassesByOrder,
  checkInPass,
  cancelPass,
};