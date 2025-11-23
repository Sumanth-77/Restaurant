import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{maxWidth:400, margin:"20px auto"}}>
      <h2>Create Account</h2>

      <div className="card">
  <form onSubmit={submit}>
    <label>Name</label>
    <input value={name} onChange={(e)=>setName(e.target.value)} />

    <label>Email</label>
    <input value={email} onChange={(e)=>setEmail(e.target.value)} />

    <label>Password</label>
    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

    <button>Register</button>
  </form>
</div>

    </div>
  );
};

export default Register;
