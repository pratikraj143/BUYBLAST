const nodemailer = require("nodemailer");

exports.sendFeedback = async (req, res) => {
  const { name, email, rating, like, improve } = req.body;

  // Setup transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const feedbackHtml = `
    <h2>📩 New Feedback Received</h2>
    <p><strong>Name:</strong> ${name || "Anonymous"}</p>
    <p><strong>Email:</strong> ${email || "Not provided"}</p>
    <p><strong>Rating:</strong> ${rating}</p>
    <p><strong>Liked:</strong> ${like || "N/A"}</p>
    <p><strong>Suggestions to Improve:</strong> ${improve}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: "buynblast@gmail.com",
      subject: "📝 New Feedback from BuyNBlast",
      html: feedbackHtml,
    });

    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send feedback" });
  }
};
