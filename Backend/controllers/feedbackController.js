const nodemailer = require("nodemailer");

// Feedback Email Handler
exports.sendFeedback = async (req, res) => {
  const { name, email, rating, like, improve } = req.body;

  // Setup transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use SSL
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  // Optional: Verify SMTP connection
  transporter.verify((err, success) => {
    if (err) {
      console.error("❌ SMTP connection failed:", err);
    } else {
      console.log("✅ SMTP is ready to send messages");
    }
  });

  // Email content
  const feedbackHtml = `
    <h2>📩 New Feedback Received</h2>
    <p><strong>Name:</strong> ${name || "Anonymous"}</p>
    <p><strong>Email:</strong> ${email || "Not provided"}</p>
    <p><strong>Rating:</strong> ${rating || "N/A"}</p>
    <p><strong>Liked:</strong> ${like || "N/A"}</p>
    <p><strong>Suggestions to Improve:</strong> ${improve || "N/A"}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // ✅ Use consistent email from env
      to: "buynblast@gmail.com",
      subject: "📝 New Feedback from BuyNBlast",
      html: feedbackHtml,
    });

    console.log("📨 Feedback email sent successfully.");
    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    res.status(500).json({ message: "Failed to send feedback" });
  }
};
