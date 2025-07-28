const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  password: String,
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
