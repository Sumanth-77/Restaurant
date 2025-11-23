import React from "react";

export default function ProductCard({ product, onAdd }) {
  const src = product.image && product.image.length ? product.image : "/logo.png";

  return (
    <div className="card">
      <img alt={product.name} src={src} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
      <h3 style={{ marginTop: 8 }}>{product.name}</h3>
      <p style={{ fontSize: 14, color: "#555" }}>{product.description}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <strong>₹{product.price}</strong>
        <button onClick={() => onAdd && onAdd()} style={{ padding: "8px 12px", borderRadius: 8, background: "#0f1724", color: "#fff", border: "none" }}>
          Add
        </button>
      </div>
    </div>
  );
}
