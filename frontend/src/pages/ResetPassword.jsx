// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import logo from "/socialsync.png";

export default function ResetPassword() {
  const { token } = useParams(); // URL se token nikalna
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.password || !form.confirm) {
      return setMsg({ type: "error", text: "Please fill both fields" });
    }
    if (form.password !== form.confirm) {
      return setMsg({ type: "error", text: "Passwords do not match" });
    }

    try {
      setLoading(true);
      const res = await API.post(`/auth/reset-password/${token}`, {
        password: form.password,
      });
      setMsg({
        type: "success",
        text: res.data.message || "Password reset successful ✅",
      });

      // ✅ Reset ke baad Auth.jsx ke login form pe bhejna
      setTimeout(() => navigate("/auth", { state: { mode: "login" } }), 1500);
    } catch (err) {
      console.error("Reset error:", err);
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to reset password",
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

      {/* Reset Password Card */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-white text-center">
          Reset Password
        </h2>

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
            type="password"
            name="password"
            placeholder="New password"
            value={form.password}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 
                       border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary 
                       outline-none transition-all"
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm new password"
            value={form.confirm}
            onChange={onChange}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
