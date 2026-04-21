import React, { useEffect } from "react";

export default function Notification({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose(); // Auto close after 4 sec
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const { email, status } = notification;

  const styles = {
    yes: {
      bg: "bg-green-500/20 border-green-400/40 text-green-300",
      icon: "🎉",
      message: "will join the event!",
    },
    no: {
      bg: "bg-red-500/20 border-red-400/40 text-red-300",
      icon: "❌",
      message: "cannot join the event.",
    },
    maybe: {
      bg: "bg-yellow-500/20 border-yellow-400/40 text-yellow-300",
      icon: "🤔",
      message: "is unsure about joining.",
    },
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-fadeInUp">
      <div
        className={`p-4 w-80 rounded-xl shadow-lg backdrop-blur-md border 
        ${styles[status].bg} transition-all duration-300`}
      >
        <p className="font-semibold text-lg flex items-center gap-2">
          <span className="text-2xl">{styles[status].icon}</span>
          {email}
        </p>
        <p className="text-sm opacity-80 mt-1">{styles[status].message}</p>
      </div>
    </div>
  );
}
