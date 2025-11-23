import React from "react";

const Cart = ({ items, removeFromCart, updateQty }) => {
  if (!items.length) return <div className="card">Cart is empty.</div>;

  return (
    <div className="card">
      {items.map((item) => (
        <div key={item._id} style={{display:"flex", justifyContent:"space-between", padding:"10px 0"}}>
          <div>{item.name}</div>

          <div>
            <button onClick={() => updateQty(item._id, item.quantity - 1)}>-</button>
            <span style={{margin:"0 8px"}}>{item.quantity}</span>
            <button onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
          </div>

          <div>₹{item.price * item.quantity}</div>

          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
