const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
// Use memory storage for multer to handle image buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route: POST /api/product/upload
router.post('/upload', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, condition, price, negotiable } = req.body;
    const uploadedImages = [];

    for (const file of req.files) {
      const base64 = Buffer.from(file.buffer).toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'buyandsell_products',
      });

      uploadedImages.push(result.secure_url);
    }

    const newProduct = new Product({
      title,
      description,
      category,
      condition,
      price,
      negotiable: negotiable === 'true' || negotiable === 'on',
      images: uploadedImages,
      user: req.user._id, // ✅ Connect product to user
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product uploaded successfully', product: newProduct });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Product upload failed.' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('user', 'name email') // ✅ This fetches user name and email
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
