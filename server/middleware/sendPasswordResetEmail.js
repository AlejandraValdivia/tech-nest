import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (token, email, name) => {
  const html = `
    <html>
      <body>
        <h3>Dear ${name}</h3>
        <p>Please click on the link below to reset your password.</p>
        <a href="http://localhost:3000/password-reset/${token}">Click here!</a>
      </body>
    </html>`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Tech Nest: Reset your password request.',
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    console.log(info.response);
    return { success: true, message: `Email sent to ${email}` };
  } catch (error) {
    console.log(`Error sending email to ${email}`, error);
    return { success: false, message: `Error sending email to ${email}` };
  }
};
