const fs = require("fs/promises");
const path = require("path");
const Handlebars = require("handlebars");

const Notification = require("./notification.model");
const { transporter } = require("./providers/email.provider");

async function compileTemplate(templateName, data) {
  const filePath = path.join(__dirname, "templates", `${templateName}.html`);

  const html = await fs.readFile(filePath, "utf8");
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
    // Remove "data:image/png;base64," prefix
    const base64 = qrBase64.replace(/^data:image\/png;base64,/, "");

    mailOptions.attachments = [
      {
        filename: "qr.png",
        content: base64,
        encoding: "base64",
        cid: "qr-code",
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
  const html = await compileTemplate("orderVerified", {
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
  const html = await compileTemplate("orderRejected", {
    buyerName,
    rejectionReason,
  });

  return sendEmail({
    to: email,
    subject: "Your E-Summit '26 Booking was Rejected",
    html,
  });
}

async function processPendingNotifications() {
  while (true) {
    const notification = await Notification.findOneAndUpdate(
      {
        status: "PENDING",
      },
      {
        $set: {
          status: "PROCESSING",
        },
      },
      {
        returnDocument: "after",
        sort: {
          createdAt: 1,
        },
      },
    );

    // Queue is empty
    if (!notification) {
      break;
    }

    try {
      switch (notification.type) {
        case "PASS_VERIFIED":
          await sendPassVerifiedEmail(notification.payload);
          break;

        case "ORDER_REJECTED":
          await sendOrderRejectedEmail(notification.payload);
          break;

        default:
          throw new Error(`Unknown notification type: ${notification.type}`);
      }

      await Notification.findByIdAndUpdate(notification._id, {
        status: "COMPLETED",
        processedAt: new Date(),
        lastError: null,
      });

      console.log(`Notification ${notification._id} processed successfully.`);
    } catch (err) {
      const attempts = notification.attempts + 1;

      await Notification.findByIdAndUpdate(notification._id, {
        attempts,
        lastError: err.message,
        status: attempts >= 5 ? "FAILED" : "PENDING",
      });

      console.error(
        `Failed to process notification ${notification._id}:`,
        err.message,
      );
    }
  }
}

module.exports = {
  sendEmail,
  sendPassVerifiedEmail,
  sendOrderRejectedEmail,
  processPendingNotifications,
};
