import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage({ cart, updateQuantity, removeItem }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Group items by id and count quantity
    const groupedItems = {};
    cart.forEach((item) => {
      const key = item._id || item.id;
      if (groupedItems[key]) {
        groupedItems[key].quantity += 1;
      } else {
        groupedItems[key] = { ...item, quantity: item.qty || 1 };
      }
    });
    setItems(Object.values(groupedItems));
  }, [cart]);

  const handleIncrease = (itemId) => {
    const item = items.find((i) => (i._id || i.id) === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecrease = (itemId) => {
    const item = items.find((i) => (i._id || i.id) === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeItem(itemId);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to proceed with checkout!");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>

      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id || item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">₹{item.price}</p>
                </div>

                <div className="quantity-control">
                  <button onClick={() => handleDecrease(item._id || item.id)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrease(item._id || item.id)}>
                    +
                  </button>
                </div>

                <div className="item-total">
                  ₹{item.price * item.quantity}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id || item.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: ₹{totalPrice}</h2>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}