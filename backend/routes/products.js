// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");

// // Get all products
// router.get("/", async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// // TEMPORARY ROUTE: Add sample products
// router.get("/add-sample", async (req, res) => {
//   try {
//     const sample = [
//       {
//         name: "Margherita Pizza",
//         description: "Classic cheese pizza with tomato sauce",
//         price: 199,
//         rating: 4.5
//       },
//       {
//         name: "Veg Biryani",
//         description: "Aromatic rice with spices and vegetables",
//         price: 159,
//         rating: 4.3
//       },
//       {
//         name: "Paneer Butter Masala",
//         description: "Creamy gravy with soft paneer cubes",
//         price: 189,
//         rating: 4.7
//       },
//       {
//         name: "French Fries",
//         description: "Crispy golden fries",
//         price: 99,
//         rating: 4.1
//       }
//     ];

//     await Product.insertMany(sample);
//     res.json({ message: "Sample products added!" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products?category=Indian&search=burger
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filters = {};

    if (category && category.toLowerCase() !== 'all') {
      // case-insensitive match
      filters.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filters).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
