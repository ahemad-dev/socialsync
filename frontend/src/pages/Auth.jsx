import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import logo from "/socialsync.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle route state from ForgotPassword.jsx
  useEffect(() => {
    if (location.state?.mode === "register") {
      setIsLogin(false);
    } else if (location.state?.mode === "login") {
      setIsLogin(true);
    }
  }, [location.state]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await API.post(endpoint, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMsg({
        type: "success",
        text: isLogin
          ? "Login successful ✅"
          : "Registered successfully 🎉",
      });

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Error occurred ❌",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-primary">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <img src={logo} alt="SocialSync Logo" className="w-12 h-12 mr-2" />
        <h1 className="text-3xl font-bold text-white">SocialSync</h1>
      </div>

      {/* Auth Card */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">
          {isLogin ? "Login" : "Register"}
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
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 
                           border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary 
                           outline-none transition-all"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 
                         border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary 
                         outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 
                         border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary 
                         outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <div className="text-right mt-2 mb-4">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-white hover:text-primary font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primaryDark py-3 rounded-xl 
                       text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Switch Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/90 flex items-center justify-center gap-2">
            <span>
              {isLogin ? "Don’t have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-semibold px-1 underline-offset-2 hover:underline active:underline focus:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
