const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  orderId: String,
  amount: Number,
  items: Array,
  status: { type: String, default: "pending" },
  paymentId: String,
  signature: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);