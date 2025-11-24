// import React from "react";

// export default function ProductCard({ product, onAdd }) {
//   const src = product.image && product.image.length ? product.image : "/logo.png";

//   return (
//     <div className="card">
//       <img alt={product.name} src={src} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
//       <h3 style={{ marginTop: 8 }}>{product.name}</h3>
//       <p style={{ fontSize: 14, color: "#555" }}>{product.description}</p>

//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
//         <strong>₹{product.price}</strong>
//         <button onClick={() => onAdd && onAdd()} style={{ padding: "8px 12px", borderRadius: 8, background: "#0f1724", color: "#fff", border: "none" }}>
//           Add
//         </button>
//       </div>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import "./ProductCard.css";

// export default function ProductCard({ product, onAdd }) {
//   const [quantity, setQuantity] = useState(1);

//   const handleIncrease = () => {
//     setQuantity(quantity + 1);
//   };

//   const handleDecrease = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   const handleAddToCart = () => {
//     for (let i = 0; i < quantity; i++) {
//       onAdd && onAdd(product);
//     }
//     setQuantity(1);
//   };

//   return (
//     <div className="product-card">
//       <img
//         src={product.image || "/images/placeholder.jpg"}
//         alt={product.name}
//         onError={(e) => {
//           e.target.src = "/images/placeholder.jpg";
//         }}
//       />
//       <h3>{product.name}</h3>
//       <p className="description">{product.description}</p>
//       <p className="price">₹{product.price}</p>

//       <div className="quantity-control">
//         <button onClick={handleDecrease}>−</button>
//         <span>{quantity}</span>
//         <button onClick={handleIncrease}>+</button>
//       </div>

//       <button onClick={handleAddToCart} className="add-btn">
//         Add to Cart
//       </button>
//     </div>
//   );
// }


import React, { useState } from "react";
import "./ProductCard.css";

export default function ProductCard({ product, onAdd, onRemove }) {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity(1);
    onAdd && onAdd(product);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
    onAdd && onAdd(product);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(0);
      onRemove && onRemove(product._id || product.id);
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.image || "/images/placeholder.jpg"}
        alt={product.name}
        onError={(e) => {
          e.target.src = "/images/placeholder.jpg";
        }}
      />
      <h3>{product.name}</h3>
      <p className="description">{product.description}</p>
      <p className="price">₹{product.price}</p>

      {quantity === 0 ? (
        <button onClick={handleAdd} className="add-btn">
          Add to Cart
        </button>
      ) : (
        <div className="quantity-control">
          <button onClick={handleDecrease}>−</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
      )}
    </div>
  );
}