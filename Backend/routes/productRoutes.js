const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   GET /api/product/all
router.get("/all", async (req, res) => {
  console.log("GET /api/product/all hit");
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// @route   POST /api/product/upload
router.post(
  "/upload",
  authMiddleware,
  upload.array("images", 5),
  async (req, res) => {
    try {
      console.log("➡️ Upload route hit");

      const { title, description, category, condition, price, negotiable } =
        req.body;
      console.log("📦 Body Data:", req.body);
      console.log("🖼️ Files Uploaded:", req.files?.length || 0);

      // Field validation
      if (!title || !description || !category || !condition || !price) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one image is required" });
      }

      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const uploadedImages = [];
      for (const file of req.files) {
        const base64 = Buffer.from(file.buffer).toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "buyandsell_products",
        });

        console.log("✅ Image uploaded:", result.secure_url);
        uploadedImages.push(result.secure_url);
      }

      const newProduct = new Product({
        title,
        description,
        category,
        condition,
        price,
        negotiable: negotiable === "true" || negotiable === "on",
        images: uploadedImages,
        user: req.user._id,
      });

      await newProduct.save();
      console.log("📦 Product saved to DB");

      // Emit real-time event
      const io = req.app.get("io");
      if (io) {
        io.emit("receive_product", newProduct);
        console.log("📡 Product emitted via Socket.io");
      }

      res.status(201).json({
        message: "Product uploaded successfully",
        product: newProduct,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({ error: "Product upload failed." });
    }
  }
);

module.exports = router;
