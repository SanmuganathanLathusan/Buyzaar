const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter object using standard SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your email password (or App Password)
    }
  });

  // Define the email options
  const mailOptions = {
    from: `Buyzaar Admin <${process.env.EMAIL_USER || 'noreply@buyzaar.com'}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.html // html body
  };

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent. Please ensure EMAIL_USER and EMAIL_PASS are configured in your backend .env file.');
  }
};

module.exports = sendEmail;
