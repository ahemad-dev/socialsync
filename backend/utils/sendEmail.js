// utils/sendEmail.js
const nodemailer = require("nodemailer");

// ✅ Transport create karne ka function
const createTransport = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    // Agar .env me apna SMTP config set hai (Gmail/Outlook/Custom SMTP)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 465,
      secure: process.env.SMTP_PORT == 465, // port 465 => secure true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // ✅ Agar SMTP config set nahi hai → Ethereal test account use hoga
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
};

// ✅ General reusable sendEmail function
exports.sendEmail = async ({ to, subject, html }) => {
  const transport = await createTransport();

  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM || '"SocialSync" <no-reply@socialsync.app>',
    to,
    subject,
    html,
  });

  return {
    messageId: info.messageId,
    preview: nodemailer.getTestMessageUrl(info) || null, // Ethereal testing ke liye preview link
  };
};
