import React, { useEffect, useState } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products')
      .then(res => {
        console.log("products fetched:", res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error("fetch products error:", err);
      });
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 8 }}>Menu</h1>
      <div className="products-grid" style={{ marginTop: 16 }}>
        {products.map(p => (
          <ProductCard key={p._id || p.id} product={p} onAdd={() => addToCart && addToCart(p)} />
        ))}
      </div>
    </div>
  );
}
