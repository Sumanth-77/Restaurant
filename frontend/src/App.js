// // import React, { useState, useEffect } from "react";
// // import "./App.css";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
//  import CartPage from "./pages/CartPage";
//  import Checkout from "./pages/Checkout";
// import Header from "./components/Header";

// // const loadCart = () => {
// //   try {
// //     const raw = localStorage.getItem("cart");
// //     return raw ? JSON.parse(raw) : [];
// //   } catch {
// //     return [];
// //   }
// // };

// // export default function App() {
// //   const [cart, setCart] = useState(loadCart);

// //   useEffect(() => {
// //     localStorage.setItem("cart", JSON.stringify(cart));
// //   }, [cart]);

// //   const addToCart = (product) => {
// //     console.log("addToCart called:", product);
// //     setCart(prev => {
// //       // find by _id or id
// //       const idKey = product._id ? "_id" : "id";
// //       const existing = prev.find(it => (it._id || it.id) === (product._id || product.id));
// //       if (existing) {
// //         return prev.map(it =>
// //           (it._id || it.id) === (product._id || product.id)
// //             ? { ...it, qty: (it.qty || 1) + 1 }
// //             : it
// //         );
// //       }
// //       // add new with qty 1
// //       return [...prev, { ...product, qty: 1 }];
// //     });
// //   };

// //   const updateQuantity = (id, qty) => {
// //     setCart(prev => prev.map(it => (it._id === id || it.id === id) ? { ...it, qty } : it));
// //   };

// //   const removeItem = (id) => {
// //     setCart(prev => prev.filter(it => !(it._id === id || it.id === id)));
// //   };

// //   return (
// //     <BrowserRouter>
// //       <Header />
// //       <div className="container">
// //         <Routes>
// //           <Route path="/" element={<Home addToCart={addToCart} />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} />} />
// //           <Route path="/checkout" element={<Checkout cart={cart} />} />
// //         </Routes>
// //       </div>
// //     </BrowserRouter>
// //   );
// // }
// //

// //2nd change

import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import CategoryPage from "./pages/CategoryPage";
import Header from "./components/Header";
import Menu from "./pages/Menu";

const loadCart = () => {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const match = prev.find(
        (i) => (i._id || i.id) === (product._id || product.id)
      );
      if (match) {
        return prev.map((i) =>
          (i._id || i.id) === (product._id || product.id)
            ? { ...i, qty: (i.qty || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((i) =>
        (i._id || i.id) === id ? { ...i, qty: qty } : i
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev.filter((i) => (i._id || i.id) !== id)
    );
  };

  return (
    <BrowserRouter>
      <Header cart={cart} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          <Route
            path="/category/:name"
            element={<CategoryPage addToCart={addToCart} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            }
          />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
