import React from "react";
import "./CartPage.css";

export default function CartPage({ cart, updateQuantity, removeItem }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-card">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item) => (
              <tr key={item._id}>
                <td className="item-name">{item.name}</td>

                <td className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.qty - 1)}>-</button>
                  <span className="qty">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.qty + 1)}>+</button>
                </td>

                <td className="item-price">₹{item.price}</td>

                <td>
                  <button className="remove-btn" onClick={() => removeItem(item._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-footer">
          <h3>Total: ₹{total}</h3>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}
