const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    rating: { type: Number, default: 0 },
    image: String
});

module.exports = mongoose.model("Product", ProductSchema);
