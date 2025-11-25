import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./UserOrders.css";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token || isAdmin) {
      alert("Please login to view orders!");
      navigate("/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="orders-container"><p>Loading...</p></div>;
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet. Start shopping!</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.orderId}</h3>
                <span className={`status ${order.status}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="order-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{order.amount}
                </p>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span>{item.name}</span>
                    <span>x {item.qty || 1}</span>
                    <span>₹{item.price * (item.qty || 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}