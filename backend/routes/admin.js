const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Get all users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Product
router.post("/products", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      image,
    });

    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Product
router.put("/products/:id", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, image },
      { new: true }
    );

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Product
router.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;