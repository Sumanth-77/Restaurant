// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     price: Number,
//     rating: { type: Number, default: 0 },
//     image: String
// });

// module.exports = mongoose.model("Product", ProductSchema);
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  rating: Number,
  image: String,
  category: { type: String, default: 'Uncategorized' } // <-- new field
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
