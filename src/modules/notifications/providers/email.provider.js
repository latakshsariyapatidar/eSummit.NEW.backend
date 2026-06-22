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

const sendMail = async ({ to, subject, html, attachments }) => {
  // TODO: Setup nodemailer transporter using env variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
  // - Send email using SMTP settings (from SMTP_FROM)
  // - Support attachments for QR code images/tickets
  logger.info(`[Email Mock] Sending to: ${to}, Subject: ${subject}`);
  return { messageId: 'mock-id' };
};

module.exports = { sendMail };
