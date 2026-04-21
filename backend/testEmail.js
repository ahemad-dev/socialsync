// backend/testEmail.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function run() {
  console.log('--- SMTP quick test ---');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  // do NOT print SMTP_PASS (secret)

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000
  });

  try {
    console.log('Verifying connection to SMTP...');
    await transport.verify();
    console.log('✅ SMTP verify succeeded');

    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.TEST_TO || process.env.SMTP_USER,
      subject: 'SocialSync SMTP test',
      text: 'This is a test from SocialSync'
    });
    console.log('Send succeeded. messageId:', info.messageId);
    if (info.previewUrl) console.log('Preview URL:', info.previewUrl);
  } catch (err) {
    console.error('❌ send/verify error:', err && err.response ? err.response : err);
  } finally {
    transport.close && transport.close();
  }
}

run();
