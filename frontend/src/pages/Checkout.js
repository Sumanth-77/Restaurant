import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token) {
      alert("Please login to checkout!");
      nav("/login");
      return;
    }

    if (isAdmin) {
      alert("Admin cannot place orders!");
      nav("/");
      return;
    }

    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || item.qty || 1),
    0
  );
  const total = subtotal - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      alert("✅ Coupon applied! 10% discount");
      setCoupon("");
    } else {
      alert("❌ Invalid coupon code");
    }
  };

  const handleRazorpayPayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to place order!");
      nav("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Step 1: Requesting Razorpay order from backend...");

      // Step 1: Get order details from backend
      const response = await API.post(
        "/orders/create",
        {
          amount: total,
          items: cart,
          discount,
          subtotal,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      const { orderId, keyId, amount, currency } = response.data;
      console.log("Step 1 ✅: Order created:", orderId);

      // Step 2: Load Razorpay script
      console.log("Step 2: Loading Razorpay script...");
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Step 2 ✅: Razorpay script loaded");

        // Step 3: Open Razorpay checkout (frontend only - no authentication needed)
        console.log("Step 3: Opening Razorpay modal...");

        const options = {
          key: keyId, // Key ID from backend
          amount: amount, // Amount from backend
          currency: currency, // Currency from backend
          name: "Restaurant",
          description: "Food Order Payment",
          order_id: orderId, // Order ID from backend
          handler: async (razorpayResponse) => {
            console.log("Step 4: Payment handler called");
            console.log("Razorpay response:", razorpayResponse);

            try {
              // Step 5: Verify payment on backend
              console.log("Step 5: Verifying payment on backend...");

              const verifyResponse = await API.post(
                "/orders/verify",
                {
                  orderId: razorpayResponse.razorpay_order_id,
                  paymentId: razorpayResponse.razorpay_payment_id,
                  signature: razorpayResponse.razorpay_signature,
                },
                {
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                  },
                }
              );

              console.log("Step 5 ✅: Verification response:", verifyResponse.data);

              if (verifyResponse.data.success) {
                localStorage.setItem("cart", "[]");
                alert("✅ Payment successful! Your order has been placed.");
                nav("/orders");
              } else {
                setError("Payment verification failed. Please try again.");
              }
            } catch (err) {
              console.error("Step 5 ❌: Verification error:", err);
              setError(
                "Payment verification failed: " +
                  (err.response?.data?.message || err.message)
              );
            }
          },
          onError: (err) => {
            console.error("❌ Razorpay error:", err);
            setError("Payment failed: " + err.description);
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

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        setError("Failed to load Razorpay script. Please try again.");
        console.error("❌ Failed to load Razorpay script");
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error("❌ Order creation error:", err);
      setError(
        "Error creating order: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <h1>Order Summary</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-grid">
          {/* Left side - Cart Items */}
          <div className="checkout-items">
            <h2>Items</h2>
            {cart.length === 0 ? (
              <p className="empty-message">Your cart is empty</p>
            ) : (
              <div className="items-list">
                {cart.map((item) => (
                  <div key={item._id} className="checkout-item">
                    <div className="item-name">
                      <span>{item.name}</span>
                      <span className="quantity">
                        x{item.quantity || item.qty || 1}
                      </span>
                    </div>
                    <div className="item-price">
                      ₹{item.price * (item.quantity || item.qty || 1)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Summary & Payment */}
          <div className="checkout-summary-section">
            <div className="price-breakdown">
              <h2>Price Details</h2>

              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="price-row discount-row">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="price-row total-row">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              <h3>Apply Coupon</h3>
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter code (e.g., SAVE10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  className="coupon-input"
                />
                <button onClick={applyCoupon} className="apply-btn">
                  Apply
                </button>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleRazorpayPayment}
              className="pay-btn"
              disabled={loading || cart.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                <>💳 Pay ₹{total.toFixed(2)}</>
              )}
            </button>

            <p className="payment-info">
              💡 Use test card: 4111 1111 1111 1111 (any future date, any CVV)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;