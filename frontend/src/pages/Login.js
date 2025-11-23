import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{maxWidth:400, margin:"20px auto"}}>
      <h2>Login</h2>

      <div className="card">
  <form onSubmit={submit}>
    <label>Email</label>
    <input value={email} onChange={(e)=>setEmail(e.target.value)} />

    <label>Password</label>
    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

    <button>Login</button>
  </form>
</div>

    </div>
  );
};

export default Login;
