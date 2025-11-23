const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Create new order (checkout)
router.post("/", authMiddleware, async (req, res) => {
    const { products, totalPrice, discount } = req.body;

    try {
        const order = new Order({
            user: req.user.id,
            products,
            totalPrice,
            discount,
        });

        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Get orders of logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("products.product", "name price");
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
