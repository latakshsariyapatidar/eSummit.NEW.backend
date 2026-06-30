/**
 * Auth Controller - E-Summit '26
 * 
 * Maps HTTP request structures (headers, cookies, query, body) to internal Auth Service methods.
 * Formats response payloads and sends JSON/Cookie outcomes back to client.
 * 
 * Logic to be implemented:
 * - registerAdminHandler()     -> Extract fields, call service, return admin profile.
 * - registerVolunteerHandler() -> Extract fields, verify action initiator is admin, create volunteer, send credentials.
 * - loginHandler()             -> Validate credentials, call auth service to sign JWT, set cookie or return token.
 * - logoutHandler()            -> Clear cookie, invalidate token, return success message.
 * - getMeHandler()             -> Read request.user (set by auth middleware) and return user details.
 * - forgotPasswordHandler()    -> Initiate mail dispatch via email provider for reset request.
 * - resetPasswordHandler()     -> Verify temporary token and update password in DB.
 */

const authService = require('./auth.service');
const apiResponse = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');
const env = require('../../common/config/env');
const User = require('./auth.model');


const verifyKey = asyncHandler(async (req, res) => {
  const key = req.body.key || req.body.admin_key;
  if (!key) {
    return apiResponse.error(res, 'Access key is required', 400);
  }

  const { token, role } = await authService.authenticateKey(key);

  // Set HTTP-Only cookie named 'token' valid for 1 day
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return apiResponse.success(res, { token, role }, 'Key verified successfully');
});

const logoutHandler = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  return apiResponse.success(res, null, 'Logged out successfully');
});

const getMeHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    return apiResponse.error(res, 'No active session found', 401);
  }
  return apiResponse.success(res, {
    ID: req.user.ID,
    role: req.user.role,
  });
});

const createKeyHandler = asyncHandler(async (req, res) => {
  const newKey = await authService.generateVolunteerKey();
  return apiResponse.success(res, newKey, 'Volunteer key generated successfully', 201);
});

const listKeysHandler = asyncHandler(async (req, res) => {
  const keys = await authService.listKeys();
  return apiResponse.success(res, keys, 'Volunteer keys retrieved successfully');
});

const deleteKeyHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await authService.deleteKey(id);
  return apiResponse.success(res, null, 'Key revoked successfully');
});

const getDbState = asyncHandler(async (req, res) => {
  const Order = require('../orders/orders.model');
  const users = await User.find({}).sort({ createdAt: -1 });
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return apiResponse.success(res, { users, orders }, 'Database state retrieved successfully');
});

const verifyOrder = asyncHandler(async (req, res) => {
  const Order = require('../orders/orders.model');
  const Pass = require('../passes/passes.model');
  const notificationsService = require('../notifications/notifications.service');

  const orderId = req.body.order_id || req.body.id || req.body.ID;
  const { status, reason } = req.body;

  if (!orderId) {
    return apiResponse.error(res, 'order_id is required', 400);
  }
  if (!status || !['verified', 'rejected'].includes(status)) {
    return apiResponse.error(res, "status must be either 'verified' or 'rejected'", 400);
  }

  const order = await Order.findOne({ ID: orderId });
  if (!order) {
    return apiResponse.error(res, 'Order not found', 404);
  }

  // Update order status
  order.Status = status;
  await order.save();

  // Find user associated with the order to retrieve buyer contact
  const buyer = await User.findOne({ ID: order.UserID });
  const buyerName = buyer ? (buyer.Name || 'Attendee') : 'Attendee';
  const buyerEmail = buyer ? (buyer.Email || '') : '';

  if (status === 'verified') {
    // Retrieve passes associated with the order
    const passes = await Pass.find({ OrderID: order.ID });
    
    // Trigger notification service
    try {
      await notificationsService.sendOrderVerificationSuccess(order, buyerName, buyerEmail, passes);
    } catch (err) {
      // Log notification dispatch failures but don't fail the verification transaction
      console.error('Failed to send verification email:', err);
    }
  } else {
    // Trigger rejection notification
    try {
      await notificationsService.sendOrderRejection(order, buyerName, buyerEmail, reason || 'Payment proof verification failed');
    } catch (err) {
      console.error('Failed to send rejection email:', err);
    }
  }

  return apiResponse.success(res, order, `Order status updated to ${status} successfully`);
});

// const getPaymentScreenshot = asyncHandler(async (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(process.cwd(), 'screenshots', filename);

//   if (!fs.existsSync(filePath)) {
//     return apiResponse.error(res, 'Screenshot file not found', 404);
//   }

//   return res.sendFile(filePath);
// });

const getPasses = asyncHandler(async (req, res) => {
  const PassAvailability = require('../passes/passAvailability.model');
  const passes = await PassAvailability.find({}).sort({ ID: 1 });
  return apiResponse.success(res, passes, 'Pass configurations retrieved successfully');
});

const updatePasses = asyncHandler(async (req, res) => {
  const PassAvailability = require('../passes/passAvailability.model');

  // Handle single object update
  if (req.body.ID !== undefined) {
    const { ID, SoldOut, Available, Price } = req.body;
    const updateData = {};
    if (SoldOut !== undefined) {updateData.SoldOut = SoldOut;}
    if (Available !== undefined) {updateData.Available = Available;}
    if (Price !== undefined) {updateData.Price = Price;}

    const pass = await PassAvailability.findOneAndUpdate({ ID }, updateData, { new: true, upsert: true });
    return apiResponse.success(res, pass, 'Pass configuration updated successfully');
  }

  // Handle bulk array update
  if (Array.isArray(req.body)) {
    const results = [];
    for (const item of req.body) {
      if (item.ID !== undefined) {
        const pass = await PassAvailability.findOneAndUpdate({ ID: item.ID }, item, { new: true, upsert: true });
        results.push(pass);
      }
    }
    return apiResponse.success(res, results, 'Pass configurations updated successfully');
  }

  return apiResponse.error(res, 'Invalid request payload structure', 400);
});

module.exports = {
  verifyKey,
  logoutHandler,
  getMeHandler,
  createKeyHandler,
  listKeysHandler,
  deleteKeyHandler,
  getDbState,
  verifyOrder,
  getPasses,
  updatePasses,
};

