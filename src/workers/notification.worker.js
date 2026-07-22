const cron = require('node-cron');
const notificationService = require('../modules/notifications/notifications.service');

// Every 5 seconds
cron.schedule('*/5 * * * * *', async () => {
  console.log('[Notification Worker] Checking pending notifications...');

  try {
    await notificationService.processPendingNotifications();
  } catch (err) {
    console.error('[Notification Worker]', err);
  }
});

console.log('Notification worker started.');