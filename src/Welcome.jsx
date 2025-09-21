// components/Welcome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);
  const handleStart = () => navigate("/login");

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <div className="auth-page-wrapper">
        <div className="auth-page">
          <div className="auth-container" style={{ textAlign: "center" }}>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              style={{ position: "absolute", top: "12px", right: "12px" }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="auth-header">
              <h1>Welcome to Your Personal Calendar</h1>
              <p>
                Organize your daily activities, schedule meetings, set reminders, 
                and make the most of your day — all in one place!
              </p>
            </div>

            <button
              className="auth-button"
              onClick={handleStart}
              style={{ marginTop: "1.5rem" }}
            >
              Launch My Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
