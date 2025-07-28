const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  condition: String,
  price: Number,
  negotiable: Boolean,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links product to the user
  },
});

module.exports = mongoose.model('Product', productSchema);
