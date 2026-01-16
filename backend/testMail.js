require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "your_real_email@gmail.com",
  subject: "Test mail",
  text: "If you see this, email works"
}).then(() => {
  console.log("MAIL SENT");
}).catch(console.error);
