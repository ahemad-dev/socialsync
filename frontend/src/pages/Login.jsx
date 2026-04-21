import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [msg, setMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await API.post("/auth/login", form);

      // ✅ Remember Me → localStorage, else sessionStorage
      const storage = form.remember ? localStorage : sessionStorage;
      storage.setItem("token", res.data.token);
      storage.setItem("user", JSON.stringify(res.data.user));

      setMsg({ type: "success", text: "Login successful ✅" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Login failed ❌",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md animate-fadeInUp">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Welcome Back 👋
        </h2>

        {/* Messages */}
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

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
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
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
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

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm text-white/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={onChange}
                className="accent-primary"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primaryDark py-3 rounded-xl 
                       text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-sm text-center text-white/70">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-primary hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
