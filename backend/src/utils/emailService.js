const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (userEmail, firstName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Welcome Aboard! 🎉 Get started with your widgets",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">Welcome, ${firstName}!</h2>
          <p>We are thrilled to have you on board! You can now start creating your own professional chatbot widgets and much more.</p>
          <p>Our platform is designed to make widget integration a breeze.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: block; width: 200px; margin: 20px auto; padding: 10px; text-align: center; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          <p>If you have any questions, just reply to this email.</p>
          <br />
          <p>Best Regards,</p>
          <p><strong>The Widget Platform Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:");
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
};
