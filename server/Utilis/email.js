import nodemailer from "nodemailer";
export const sendMail = async (options) => {
  const smtpConfig = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PASSWORD,
    secure: false, 
    auth: {
      user:process.env.MAIL_USERNAME ,
      pass: process.env.MAIL_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    from: 'Shofy <sabreenahmed4444@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error:', error.message);
    }
    console.log('Email sent:', info.response);
  });
};