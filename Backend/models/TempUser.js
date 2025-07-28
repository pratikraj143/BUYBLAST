const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpires: Date,
  createdAt: { type: Date, default: Date.now, expires: 600 }, // auto-delete in 10 min
});

module.exports = mongoose.model("TempUser", tempUserSchema);
