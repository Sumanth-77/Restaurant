import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token || !isAdmin) {
      alert("Admin access only!");
      navigate("/");
      return;
    }
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        await API.put(`/admin/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product updated!");
        setEditingId(null);
      } else {
        await API.post("/admin/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product added!");
      }

      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
      });
      fetchProducts();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setActiveTab("products");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product deleted!");
        fetchProducts();
      } catch (err) {
        alert("Error deleting product");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Delete this user? This action cannot be undone!")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User deleted!");
        fetchUsers();
      } catch (err) {
        alert("Error deleting user");
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      {activeTab === "products" && (
        <div className="admin-content">
          <div className="form-section">
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
              />

              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      price: "",
                      description: "",
                      category: "",
                      image: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="products-section">
            <h2>Products List</h2>
            <div className="products-table">
              {products.map((product) => (
                <div key={product._id} className="product-row">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>₹{product.price}</p>
                    <p className="category">{product.category}</p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="users-section">
          <h2>Users Management</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}