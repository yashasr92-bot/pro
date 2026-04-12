import React, { useState } from "react";
import farmImg from "../assets/farm.jpg"; // ✅ local image

function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (data && data.user) {
        onLogin(data.user);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🌾 Labour App</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.btn}>
          Login
        </button>

        <p style={styles.link} onClick={goToRegister}>
          New user? Register
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    // ✅ LOCAL IMAGE (100% WORKING)
    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${farmImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  card: {
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.2)",
    padding: "40px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "none",
    outline: "none",
  },

  btn: {
    width: "100%",
    padding: "10px",
    background: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  link: {
    marginTop: "15px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;