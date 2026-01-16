const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReviewEmail = async ({ to, decision, feedback }) => {
  const mailOptions = {
    from: `"Prephire" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your resume has been reviewed",
    html: `
      <p>Your resume has been reviewed.</p>
      <p><strong>Decision:</strong> ${decision}</p>
      <p><strong>Feedback:</strong> ${feedback || "No feedback provided"}</p>
      <p>Please log in to view details.</p>
      <br/>
      <p>– Prephire Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReviewEmail;
