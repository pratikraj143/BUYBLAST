const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

router.post(
  "/upload",
  authMiddleware,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { title, description, category, condition, price, negotiable } =
        req.body;

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

      // 🔴 Emit the product in real-time
      const io = req.app.get("io");
      io.emit("receive_product", newProduct);

      res.status(201).json({
        message: "Product uploaded successfully",
        product: newProduct,
      });
    } catch (error) {
      console.error("Upload error:", error.message);
      res.status(500).json({ error: "Product upload failed." });
    }
  }
);

module.exports = router;
