const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../models/Order");
const axios = require("axios");

router.post("/create", async (req, res) => {
  try {
    const { amount, items } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    // Create order via Razorpay API
    const response = await axios.post(
      "https://api.razorpay.com/v1/orders",
      options,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    // Save order in database
    const order = new Order({
      orderId: response.data.id,
      amount,
      items,
      status: "pending",
    });

    await order.save();

    res.json({ orderId: response.data.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      // Payment verified
      await Order.findOneAndUpdate({ orderId }, { status: "completed" });
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;