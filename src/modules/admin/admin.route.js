const express = require('express');
const adminRouter = express.Router();
const adminController = require('./admin.controller');
const { verifyAdminKey } = require('./admin.middleware');


// Admin Routes

adminRouter.post('/keys', verifyAdminKey, adminController.createKeyHandler);
adminRouter.get('/keys', verifyAdminKey, adminController.listKeysHandler);
adminRouter.delete('/keys/:id', verifyAdminKey, adminController.deleteKeyHandler);


module.exports = adminRouter;