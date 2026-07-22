const fs = require('fs/promises');
const path = require('path');
const Handlebars = require('handlebars');

const Notification = require('./notification.model');
const { transporter } = require('./providers/email.provider');

let isProcessing = false;

const MAX_BATCH_SIZE = 10;
const MAX_RETRIES = 5;

const RECOVERY_TIMEOUT = 10 * 60 * 1000;
const SMTP_DELAY = 5000;

const RETRY_DELAYS = [
  30 * 1000,
  60 * 1000,
  2 * 60 * 1000,
  5 * 60 * 1000,
  10 * 60 * 1000,
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function compileTemplate(templateName, data) {
  const filePath = path.join(__dirname, 'templates', `${templateName}.html`);
  const html = await fs.readFile(filePath, 'utf8');

  return Handlebars.compile(html)(data);
}

async function sendEmail({
  to,
  from = process.env.SMTP_USER,
  subject,
  html,
  text,
  qrBase64,
}) {
  const mailOptions = {
    from,
    to,
    subject,
    html,
    text,
  };

  if (qrBase64) {
    const base64 = qrBase64.replace(/^data:image\/png;base64,/, '');

    mailOptions.attachments = [
      {
        filename: 'qr.png',
        content: base64,
        encoding: 'base64',
        cid: 'qr-code',
      },
    ];
  }

  return transporter.sendMail(mailOptions);
}

async function sendPassVerifiedEmail({
  email,
  attendeeName,
  passId,
  orderId,
  qrBase64,
}) {
  const html = await compileTemplate('orderVerified', {
    buyerName: attendeeName,
    passId,
    orderId,
  });

  return sendEmail({
    to: email,
    subject: "Your E-Summit '26 Pass is Ready",
    html,
    qrBase64,
  });
}

async function sendOrderRejectedEmail({ email, buyerName, rejectionReason }) {
  const html = await compileTemplate('orderRejected', {
    buyerName,
    rejectionReason,
  });

  return sendEmail({
    to: email,
    subject: "Your E-Summit '26 Booking was Rejected",
    html,
  });
}

const handlers = {
  PASS_VERIFIED: sendPassVerifiedEmail,
  ORDER_REJECTED: sendOrderRejectedEmail,
};

async function processPendingNotifications() {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  try {
    console.log('[Notification Worker] Processing notification queue...');

    // Recover notifications stuck in PROCESSING
    await Notification.updateMany(
      {
        status: 'PROCESSING',
        processingStartedAt: {
          $lt: new Date(Date.now() - RECOVERY_TIMEOUT),
        },
      },
      {
        $set: {
          status: 'PENDING',
          processingStartedAt: null,
          nextRetryAt: new Date(),
        },
      },
    );

    for (let i = 0; i < MAX_BATCH_SIZE; i++) {
      const notification = await Notification.findOneAndUpdate(
        {
          status: 'PENDING',
          nextRetryAt: {
            $lte: new Date(),
          },
        },
        {
          $set: {
            status: 'PROCESSING',
            processingStartedAt: new Date(),
          },
        },
        {
          sort: {
            createdAt: 1,
          },
          returnDocument: 'after',
        },
      );

      if (!notification) {
        break;
      }

      console.log(
        `[Notification] Processing ${notification._id} (${notification.type})`,
      );

      try {
        const handler = handlers[notification.type];

        if (!handler) {
          throw new Error(`Unknown notification type: ${notification.type}`);
        }

        await handler(notification.payload);

        await Notification.findByIdAndUpdate(notification._id, {
          status: 'COMPLETED',
          processedAt: new Date(),
          processingStartedAt: null,
          nextRetryAt: null,
          lastError: null,
        });

        console.log(`[Notification] Completed ${notification._id}`);
      } catch (err) {
        const attempts = notification.attempts + 1;

        const retryDelay =
          RETRY_DELAYS[Math.min(attempts - 1, RETRY_DELAYS.length - 1)];

        await Notification.findByIdAndUpdate(notification._id, {
          attempts,
          status: attempts >= MAX_RETRIES ? 'FAILED' : 'PENDING',
          processingStartedAt: null,
          nextRetryAt: new Date(Date.now() + retryDelay),
          lastError: err.message,
        });

        console.error('[Notification] Failed', {
          notificationId: notification._id.toString(),
          type: notification.type,
          attempts,
          message: err.message,
          code: err.code,
          response: err.response,
        });
      }

      const hasMore = await Notification.exists({
        status: 'PENDING',
        nextRetryAt: {
          $lte: new Date(),
        },
      });

      if (hasMore) {
        await sleep(SMTP_DELAY);
      }
    }
  } catch (err) {
    console.error('[Notification Worker]', err);
  } finally {
    isProcessing = false;
  }
}

module.exports = {
  sendEmail,
  sendPassVerifiedEmail,
  sendOrderRejectedEmail,
  processPendingNotifications,
};
