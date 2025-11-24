import React, { useEffect, useState } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";
import "./Menu.css";

export default function Menu({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/products");
      const cats = Array.from(
        new Set(res.data.map((p) => p.category || "Uncategorized"))
      );
      setCategories(["All", ...cats]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setActiveCategory("All");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchByCategory = async (category) => {
    try {
      const res = await API.get("/products", {
        params: { category },
      });
      setProducts(res.data);
      setActiveCategory(category);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryClick = (category) => {
    if (category === "All") {
      fetchAllProducts();
    } else {
      fetchByCategory(category);
    }
  };

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>

      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard
            key={p._id || p.id}
            product={p}
            onAdd={() => addToCart && addToCart(p)}
          />
        ))}
      </div>
    </div>
  );
}
