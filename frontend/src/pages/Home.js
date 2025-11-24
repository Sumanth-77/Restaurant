// import React, { useEffect, useState } from "react";
// import API from "../api";
// import ProductCard from "../components/ProductCard";

// export default function Home({ addToCart }) {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     API.get('/products')
//       .then(res => {
//         console.log("products fetched:", res.data);
//         setProducts(res.data);
//       })
//       .catch(err => {
//         console.error("fetch products error:", err);
//       });
//   }, []);

//   return (
//     <div>
//       <h1 style={{ marginTop: 8 }}>Menu</h1>
//       <div className="products-grid" style={{ marginTop: 16 }}>
//         {products.map(p => (
//           <ProductCard key={p._id || p.id} product={p} onAdd={() => addToCart && addToCart(p)} />
//         ))}
//       </div>
//     </div>
//   );
// }


// 2nd change
// import React, { useEffect, useState } from "react";
// import API from "../api";
// import ProductCard from "../components/ProductCard";
// import CategoryBar from "../components/CategoryBar";

// export default function Home({ addToCart }) {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]); // unique categories
//   const [active, setActive] = useState('All');
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts('All', '');
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await API.get('/products'); // get full list
//       const cats = Array.from(new Set(res.data.map(p => p.category || 'Uncategorized')));
//       setCategories(cats);
//     } catch (err) { console.error(err); }
//   };

//   const fetchProducts = async (cat = 'All', q = '') => {
//     try {
//       const params = {};
//       if (cat && cat !== 'All') params.category = cat;
//       if (q) params.search = q;
//       const res = await API.get('/products', { params });
//       setProducts(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const onCategorySelect = (cat) => {
//     setActive(cat);
//     fetchProducts(cat, search);
//   };

//   const onSearch = (e) => {
//     const q = e.target.value;
//     setSearch(q);
//     fetchProducts(active, q);
//   };

//   return (
//     <div>
//       <h1>Menu</h1>

//       <div style={{ display:'flex', gap:12, alignItems:'center', marginTop:8 }}>
//         <CategoryBar categories={categories} active={active} onSelect={onCategorySelect} />
//         <input style={{ marginLeft:'auto', padding:8, borderRadius:8 }} placeholder="Search..." value={search} onChange={onSearch} />
//       </div>

//       <div className="products-grid" style={{ marginTop: 16 }}>
//         {products.map(p => (
//           <ProductCard key={p._id || p.id} product={p} onAdd={() => addToCart && addToCart(p)} />
//         ))}
//       </div>
//     </div>
//   );
// }


//3rd

// // frontend/src/pages/Home.js
// import React, { useEffect, useState } from "react";
// import API from "../api";
// import CategoryLinks from "../components/CategoryLinks";

// export default function Home({ addToCart }) {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     // fetch categories from products (simple)
//     API.get('/products')
//       .then(res => {
//         const cats = Array.from(new Set(res.data.map(p => p.category || 'Uncategorized')));
//         setCategories(cats);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div style={{ marginTop: 12 }}>
//       <section style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:20, alignItems:'center' }}>
//         <div>
//           <h1 style={{ fontSize:40, margin:0 }}>Taste the best — delivered</h1>
//           <p style={{ color:'#555', marginTop:12 }}>Explore our curated menu. Click a cuisine to view dishes.</p>

//           <CategoryLinks categories={categories} />

//           <div style={{ marginTop:16 }}>
//             <a href="/category/Indian" style={{ marginRight: 8 }}>Popular: Indian</a>
//             <a href="/category/Chinese" style={{ marginRight: 8 }}>Chinese</a>
//             <a href="/category/Italian">Italian</a>
//           </div>
//         </div>

//         <div style={{ borderRadius:12, overflow:'hidden', boxShadow:'0 6px 18px rgba(16,24,40,0.06)' }}>
//           {/* Video: YouTube embed (recommended) */}
//           <div style={{ position:'relative', paddingTop:'56.25%' }}>
//             <iframe
//               src="https://www.youtube.com/embed/3AAdKl1UYZs" // replace with any youtube id you like
//               title="Food video"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:0 }}
//             />
//           </div>

//           {/* Optional: If you want to use a local video file instead of YouTube, uncomment below
//             and place video in public/videos/food.mp4
//           */}
//           {/*
//           <video controls poster="/images/pizza.jpg" style={{ width:'100%', display:'block' }}>
//             <source src="/videos/food.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//           */}
//         </div>
//       </section>

//       <hr style={{ margin: '28px 0' }} />

//       <div>
//         <h3>Quick links</h3>
//         <CategoryLinks categories={categories} />
//       </div>
//     </div>
//   );
// }
//4th
// frontend/src/pages/Home.js
import React, { useEffect, useState } from "react";
import API from "../api";
import CategoryLinks from "../components/CategoryLinks";
import "./Home.css";

export default function Home({ addToCart }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const cats = Array.from(
          new Set(res.data.map((p) => p.category || "Uncategorized"))
        );
        setCategories(cats);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <video
        className="home-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/pizza.jpg"
        src="/videos/chef.mp4"
      />

      <div className="home-overlay">
        <h1 className="home-title">Welcome to Our Restaurant</h1>
        <p className="home-subtitle">
          Delicious food, fresh ingredients, unforgettable taste 🍽️🔥
        </p>

        {/* <CategoryLinks categories={categories} /> */}

        <button
          className="explore-btn"
          onClick={() => (window.location.href = "/menu")}
        >
          View All Menu
        </button>
      </div>
    </div>
  );
}