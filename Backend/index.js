const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// ✅ Make sure these files exist and are exporting `router`
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/product", require("./routes/productRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
