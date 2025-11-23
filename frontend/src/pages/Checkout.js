import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      alert("Coupon applied!");
    } else {
      alert("Invalid coupon");
    }
  };

  const payNow = async () => {
    try {
      await API.post("/orders", {
        products: cart.map(c => ({ product: c._id, quantity: c.quantity })),
        totalPrice: total,
        discount
      });

      localStorage.setItem("cart", "[]");
      alert("Payment Successful!");
      nav("/");
    } catch (err) {
      alert("Payment Failed");
    }
  };

  return (
    <div style={{maxWidth:600, margin:"20px auto"}}>
      <h1>Checkout</h1>

      <div className="card" style={{padding:16}}>
        {cart.map(item => (
          <div key={item._id} style={{display:"flex", justifyContent:"space-between"}}>
            <div>{item.name} x {item.quantity}</div>
            <div>₹{item.price * item.quantity}</div>
          </div>
        ))}

        <hr />

        <p>Subtotal: ₹{subtotal}</p>
        <p>Discount: ₹{discount}</p>
        <h3>Total: ₹{total}</h3>

        <input
          placeholder="Coupon code"
          value={coupon}
          onChange={(e)=>setCoupon(e.target.value)}
          style={{padding:8, marginTop:12}}
        />

        <button onClick={applyCoupon} style={{marginLeft:8}}>Apply</button>

        <button onClick={payNow} style={{marginTop:16, width:"100%"}}>
          Pay Now (Demo)
        </button>
      </div>
    </div>
  );
};

export default Checkout;
