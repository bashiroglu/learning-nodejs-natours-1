const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  // const transport = nodemailer.createTransport({
  //   host: 'smtp.mailtrap.io',
  //   port: 587,
  //   auth: {
  //     user: '89b006bead4cfc',
  //     pass: 'f53e91614b32b7'
  //   }
  // });\
  // 1) Create a transport via gmail
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

  const mailOptions = {
    from: 'Abdulla Bashiroghlu <abdullabashir32@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
