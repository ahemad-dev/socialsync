import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"; // ✅ sirf Routes aur Route
import SplashScreen from "./components/SplashScreen";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RSVP from "./pages/RSVP";
import EventResponses from "./pages/EventResponses";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rsvp/:token" element={<RSVP />} />
      <Route path="/event/:eventId/responses" element={<EventResponses />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
