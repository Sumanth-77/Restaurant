import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.price * (item.quantity || item.qty || 1), 0);
  const total = subtotal - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      alert("Coupon applied! 10% discount");
    } else {
      alert("Invalid coupon");
    }
  };

  const handleRazorpayPayment = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const response = await API.post("/orders/create", {
        amount: total,
        items: cart,
        discount,
        subtotal,
      });

      const { orderId } = response.data;

      // Razorpay options
      const options = {
        key: "rzp_test_RjfCP34ylgL6kX", // Replace with your key
        amount: total * 100, // Amount in paise
        currency: "INR",
        name: "Restaurant",
        description: "Food Order Payment",
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await API.post("/orders/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              localStorage.setItem("cart", "[]");
              alert("Payment successful! Order placed.");
              nav("/");
            }
          } catch (err) {
            alert("Payment verification failed!");
            console.error(err);
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#e74c3c",
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Error creating order!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-card">
        <h2>Order Summary</h2>

        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="checkout-item">
              <span>{item.name}</span>
              <span>x {item.quantity || item.qty || 1}</span>
              <span className="price">
                ₹{item.price * (item.quantity || item.qty || 1)}
              </span>
            </div>
          ))}
        </div>

        <div className="checkout-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row discount">
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="coupon-section">
          <input
            type="text"
            placeholder="Enter coupon code (Try: SAVE10)"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="coupon-input"
          />
          <button onClick={applyCoupon} className="apply-btn">
            Apply
          </button>
        </div>

        <button
          onClick={handleRazorpayPayment}
          className="pay-btn"
          disabled={loading || cart.length === 0}
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;