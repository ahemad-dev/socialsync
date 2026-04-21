// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import logo from "/socialsync.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!email) {
      setMsg({ type: "error", text: "Please enter your email." });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      setMsg({
        type: "success",
        text: res.data.message || "Reset link sent — check your inbox.",
      });
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to send reset link. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-primary">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <img src={logo} alt="SocialSync Logo" className="w-12 h-12 mr-2" />
        <h1 className="text-3xl font-bold text-white">SocialSync</h1>
      </div>

      {/* Forgot Password Card */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-2 text-white text-center">
          Forgot Password
        </h2>
        <p className="text-sm text-white/70 mb-6 text-center">
          Enter the email you registered with. We’ll send a secure link to reset
          your password.
        </p>

        {msg && (
          <div
            className={`p-3 mb-4 rounded-lg text-center ${
              msg.type === "success"
                ? "bg-green-500/20 text-green-300 border border-green-400/40"
                : "bg-red-500/20 text-red-300 border border-red-400/40"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 
                       border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary 
                       outline-none transition-all"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition 
              ${
                loading
                  ? "bg-primary/60 cursor-wait"
                  : "bg-gradient-to-r from-primary to-primaryDark hover:scale-105"
              }`}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {/* Links */}
       <div className="mt-8 text-sm text-center text-white/90 flex justify-center gap-4">
  <Link
    to="/auth"
    state={{ mode: "login" }}
    className="text-white font-semibold underline-offset-2 hover:underline"
  >
    Back to Login
  </Link>
  <span className="text-white/60">|</span>
  <Link
    to="/auth"
    state={{ mode: "register" }}
    className="text-white font-semibold underline-offset-2 hover:underline"
  >
    Register
  </Link>
</div>

      </div>
    </div>
  );
}
