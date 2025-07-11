const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  }
});

module.exports = async function sendConfirmationEmail(name, to, code) {
  const mailOptions = {
    from: 'FutureForge <no-reply@futureforge.ai>',
    to,
    subject: 'Verify Your FutureForge Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0;">
        <h2 style="color: #2c3e50;">Welcome to FutureForge</h2>
        <p>Dear ${name},</p>
        <p>Thank you for signing up with <strong>FutureForge</strong>. To complete your registration and ensure the security of your account, please verify your email address by entering the confirmation code below:</p>
        
        <div style="font-size: 24px; font-weight: bold; color: #2c3e50; background: #e8f5e9; padding: 10px 16px; border-radius: 6px; width: fit-content; margin: 16px 0;">
          ${code}
        </div>

        <p>This code will expire in <strong>1 minute</strong>. If it expires, you can request a new one from the confirmation page.</p>

        <p>If you did not initiate this request or create a FutureForge account, please ignore this email.</p>
        
        <br />
        <p>Best regards,</p>
        <p><strong>The FutureForge Team</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
