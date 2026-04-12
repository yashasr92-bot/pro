import React, { useState } from "react";

function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");

  const register = async () => {
    if (!name || !email || !password || !role) {
      alert("All fields required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (data && data.user) {
        alert("Registered successfully");
        goToLogin();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>

      {/* ✅ BACK BUTTON (FIXED POSITION) */}
      <button style={styles.backBtn} onClick={goToLogin}>
        ← Back
      </button>

      <div style={styles.card}>
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

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

        <select
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="worker">Worker</option>
          <option value="owner">Owner</option>
        </select>

        <button onClick={register} style={styles.btn}>
          Register
        </button>
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
    background:
      "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  // ✅ FIXED BACK BUTTON (ALWAYS VISIBLE)
  backBtn: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 999,
    padding: "10px 15px",
    background: "rgba(0,0,0,0.7)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  card: {
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.2)",
    padding: "40px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    color: "white",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "none",
  },

  btn: {
    width: "100%",
    padding: "10px",
    background: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default Register;