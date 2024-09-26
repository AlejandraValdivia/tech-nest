import nodemailer from 'nodemailer';

export const sendVerificationEmail = (token, email, name) => {
	const html = `
	  <html>
		<body>
		  <h3>Dear ${name}</h3>
		  <p>Please click on the link below to verify your email.</p>
		  <a href="http://localhost:3000/api/users/verify-email?token=${token}">Click here to verify your email</a>
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
	  subject: 'Verify your email',
	  html: html,
	};
  
	transporter.sendMail(mailOptions, (error, info) => {
	  if (error) {
		console.log(error);
	  } else {
		console.log(`Verification email sent to ${email}`);
	  }
	});
  };
  