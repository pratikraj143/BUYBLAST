const express = require("express");
const router = express.Router();

// Placeholder route - you can add actual product functionality later
router.get("/", (req, res) => {
  res.json({ message: "Product routes working" });
});

module.exports = router;
