import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Login from "./components/Login";
import Register from "./components/Register";
import JobsList from "./components/JobsList";
import PostJob from "./components/PostJob";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔐 LOGIN / REGISTER WITH ANIMATION
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>🌾 Labour App</h2>

        <AnimatePresence mode="wait">
          {showRegister ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -120 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Register goToLogin={() => setShowRegister(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 120 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Login
                onLogin={handleLogin}
                goToRegister={() => setShowRegister(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ✅ DASHBOARD
  return (
    <div style={{ padding: "20px" }}>
      <h3>
        Welcome {user.name} ({user.role})
      </h3>

      <button onClick={handleLogout}>Logout</button>

      {/* 👨‍🌾 OWNER ONLY */}
      {user.role === "owner" && <PostJob />}

      <JobsList />
    </div>
  );
}

export default App;