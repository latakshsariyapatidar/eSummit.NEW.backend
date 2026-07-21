const adminService = require('./admin.service');
const apiResponse = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');

const createKeyHandler = asyncHandler(async (req, res) => {
  const newKey = await adminService.generateVolunteerKey();
  return apiResponse.success(
    res,
    newKey,
    'Volunteer key generated successfully',
    201,
  );
});

const listKeysHandler = asyncHandler(async (req, res) => {
  const keys = await adminService.listKeys();
  return apiResponse.success(
    res,
    keys,
    'Volunteer keys retrieved successfully',
  );
});

const deleteKeyHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deleteKey(id);
  return apiResponse.success(res, null, 'Key revoked successfully');
});

module.exports = {
  createKeyHandler,
  listKeysHandler,
  deleteKeyHandler,
};
