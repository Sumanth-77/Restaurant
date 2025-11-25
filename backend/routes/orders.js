const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const Razorpay = require("razorpay");

// Initialize Razorpay with credentials (SERVER SIDE ONLY)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { amount, items } = req.body;
    const userId = req.userId;

    console.log("=== ORDER CREATION (SERVER SIDE) ===");
    console.log("User ID:", userId);
    console.log("Amount:", amount);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ 
        message: "Razorpay credentials not configured" 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    console.log("Creating Razorpay order with amount:", options.amount);

    // Create order using Razorpay SDK (NOT axios)
    const razorpayOrder = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", razorpayOrder.id);

    // Save order to database
    const order = new Order({
      userId: userId,
      orderId: razorpayOrder.id,
      amount: amount,
      items: items,
      status: "pending",
    });

    await order.save();
    console.log("✅ Order saved to database");

    // Send order details to frontend (frontend will open Razorpay modal)
    res.json({ 
      orderId: razorpayOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID, // Send key_id to frontend
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error("=== ORDER CREATION ERROR ===");
    console.error("Error:", err.message);
    res.status(500).json({ 
      message: err.message || "Failed to create order",
    });
  }
});

router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    console.log("=== PAYMENT VERIFICATION (SERVER SIDE) ===");
    console.log("Order ID:", orderId);
    console.log("Payment ID:", paymentId);

    // Verify signature using Razorpay's utility
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === signature;
    console.log("Signature valid:", isSignatureValid);

    if (isSignatureValid) {
      console.log("✅ Payment verified!");

      // Update order status
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        {
          status: "completed",
          paymentId: paymentId,
          signature: signature,
        },
        { new: true }
      );

      console.log("✅ Order updated:", updatedOrder._id);

      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        order: updatedOrder
      });
    } else {
      console.log("❌ Signature mismatch!");
      res.status(400).json({
        success: false,
        message: "Invalid signature - Payment verification failed",
      });
    }
  } catch (err) {
    console.error("=== VERIFICATION ERROR ===");
    console.error("Error:", err.message);
    res.status(500).json({ 
      message: err.message || "Verification failed" 
    });
  }
});

// Get user's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;