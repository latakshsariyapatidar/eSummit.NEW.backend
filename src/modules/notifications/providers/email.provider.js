/**
 * Email Provider - E-Summit '26
 *
 * Sets up Nodemailer transporter using credentials supplied in the configuration environment.
 * Dispatches HTML formatted emails.
 *
 * Core responsibilities:
 * - sendMail({ to, subject, html, attachments })
 *   - Creates SMTP transporter.
 *   - Sets sender (SMTP_FROM).
 *   - Invokes transporter.sendMail() and returns promise result.
 */

const nodemailer = require('nodemailer');
const env = require('../../../common/config/env');
const logger = require('../../../common/lib/logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


async function initEmailProvider() {
  await transporter.verify();
  console.log('SMTP connection verified');
}

module.exports = {
  transporter,
  initEmailProvider,
};
