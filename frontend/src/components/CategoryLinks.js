// frontend/src/components/CategoryLinks.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryLinks.css";

export default function CategoryLinks({ categories }) {
  const navigate = useNavigate();

  return (
    <div className="category-links">
      {["All", ...categories].map(cat => (
        <button
          key={cat}
          className="cat-btn"
          onClick={() => navigate(cat === "All" ? "/" : `/category/${encodeURIComponent(cat)}`)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

