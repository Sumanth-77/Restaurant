// frontend/src/pages/CategoryPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ProductCard from "../components/ProductCard";

export default function CategoryPage({ addToCart }) {
  const { name } = useParams(); // e.g. "Indian"
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = {};
    if (name && name.toLowerCase() !== 'all') params.category = name;
    API.get('/products', { params })
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, [name]);

  return (
    <div style={{ marginTop: 12 }}>
      <h2>{decodeURIComponent(name)}</h2>
      <div className="products-grid" style={{ marginTop: 12 }}>
        {products.length === 0 ? (
          <div className="card">No items found in this category.</div>
        ) : (
          products.map(p => <ProductCard key={p._id || p.id} product={p} onAdd={() => addToCart && addToCart(p)} />)
        )}
      </div>
    </div>
  );
}
