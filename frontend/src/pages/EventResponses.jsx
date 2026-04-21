import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Notification from "../components/Notification";
import io from "socket.io-client";
import ResponsesSkeleton from "../components/ResponsesSkeleton";
import { motion } from "framer-motion";

// ✅ Socket connection
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function EventResponses() {
  const { eventId } = useParams();
  const [responses, setResponses] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ yes: 0, no: 0, maybe: 0 });
  const [notification, setNotification] = useState(null);

  // ✅ New States for Filter + Search
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Update summary counts
  const updateSummary = (data) => {
    const counts = { yes: 0, no: 0, maybe: 0 };
    data.forEach((r) => {
      if (r.status === "yes") counts.yes++;
      else if (r.status === "no") counts.no++;
      else if (r.status === "maybe") counts.maybe++;
    });
    setSummary(counts);
  };

  // ✅ Fetch event + responses
  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/rsvp/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responsesData = res.data.responses || [];
      setResponses(responsesData);
      setEvent(res.data.event || null);
      updateSummary(responsesData);
    } catch (err) {
      console.error("Error fetching responses:", err);
      setError("Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();

    // ✅ Real-time updates via socket
    socket.on("new_response", (data) => {
      setNotification({
        email: data.email,
        status: data.status,
        comment: data.comment || "—",
      });

      setResponses((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((r) => r.email === data.email);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], ...data };
        } else {
          updated.push(data);
        }
        updateSummary(updated);
        return updated;
      });
    });

    return () => socket.off("new_response");
  }, [eventId]);

  // ✅ Download CSV
  const downloadCSV = () => {
    if (responses.length === 0) {
      alert("No responses to download!");
      return;
    }

    const headers = ["Email", "Status", "Comment", "Responded At"];
    const rows = responses.map((r) => [
      r.email,
      r.status.toUpperCase(),
      r.responseComment || "NA",
      r.respondedAt
        ? new Date(r.respondedAt).toLocaleString("en-IN", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "NA",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "responses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Apply Filter + Search
  const visibleResponses = responses.filter((r) => {
    const matchesFilter = filter === "all" ? true : r.status === filter;
    const matchesSearch = r.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <ResponsesSkeleton />;
  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 animate-fadeInUp">
        Event Responses
      </h2>

      {/* ✅ Event Info Card */}
      {event && (
        <div
          className="bg-white/10 p-5 rounded-xl mb-6 shadow-lg backdrop-blur-md animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="text-2xl font-semibold">{event.title}</h3>
          <p className="text-white/80 mt-1">{event.description}</p>
          <p className="text-sm text-white/70 mt-2">
            📅 {new Date(event.date).toLocaleString()}
          </p>
          <p className="text-sm text-white/70">
            📍 {event.venue}, {event.city}, {event.state}, {event.country}
          </p>
        </div>
      )}

      {/* ✅ Filter + Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["all", "yes", "no", "maybe"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {f === "all"
                ? "All"
                : f === "yes"
                ? "✅ Yes"
                : f === "no"
                ? "❌ No"
                : "🤔 Maybe"}
            </button>
          ))}
        </div>

        {/* Search by Email */}
        <input
          type="text"
          placeholder="🔍 Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                     text-white placeholder-white/50 focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* ✅ Animated Summary Cards */}
      {/* ✅ Interactive Summary Cards */}
<div
  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fadeInUp"
  style={{ animationDelay: "0.4s" }}
>
  {/* YES */}
  <div
    onClick={() => setFilter("yes")}
    className={`cursor-pointer p-4 rounded-xl shadow text-center transition 
                ${filter === "yes" ? "ring-2 ring-green-400" : "bg-green-500/20"}`}
  >
    <motion.p
      key={summary.yes}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-4xl font-bold text-green-400"
    >
      {summary.yes}
    </motion.p>
    <p className="text-sm mt-1">✅ Yes</p>
  </div>

  {/* NO */}
  <div
    onClick={() => setFilter("no")}
    className={`cursor-pointer p-4 rounded-xl shadow text-center transition 
                ${filter === "no" ? "ring-2 ring-red-400" : "bg-red-500/20"}`}
  >
    <motion.p
      key={summary.no}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-4xl font-bold text-red-400"
    >
      {summary.no}
    </motion.p>
    <p className="text-sm mt-1">❌ No</p>
  </div>

  {/* MAYBE */}
  <div
    onClick={() => setFilter("maybe")}
    className={`cursor-pointer p-4 rounded-xl shadow text-center transition 
                ${filter === "maybe" ? "ring-2 ring-yellow-400" : "bg-yellow-500/20"}`}
  >
    <motion.p
      key={summary.maybe}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-4xl font-bold text-yellow-400"
    >
      {summary.maybe}
    </motion.p>
    <p className="text-sm mt-1">🤔 Maybe</p>
  </div>
</div>

      {/* ✅ Download Button */}
      <div className="mb-6 text-right">
        <button
          onClick={downloadCSV}
          className="bg-gradient-to-r from-primary to-primaryDark px-5 py-2 rounded-lg shadow hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          ⬇ Download Responses (CSV)
        </button>
      </div>

      {/* ✅ Responses Table / Empty State */}
      {visibleResponses.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 animate-fadeInUp"
          style={{ animationDelay: "0.6s" }}
        >
          <img
            src="/empty-responses.svg"
            alt="No responses"
            className="w-32 mb-4 opacity-80"
          />
          <p className="text-white/70 text-lg">📭 No responses found!</p>
          <p className="text-white/50 text-sm">
            Try adjusting filter or search by email.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-white/20 rounded-lg shadow-md">
            <thead>
              <tr className="bg-white/10 text-left text-white">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Responded At</th>
              </tr>
            </thead>
            <tbody>
              {visibleResponses.map((r, idx) => (
                <tr
                  key={idx}
                  className="border-t border-white/10 hover:bg-white/5 animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        r.status === "yes"
                          ? "bg-green-500/20 text-green-300"
                          : r.status === "no"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.responseComment ? r.responseComment : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.respondedAt
                      ? new Date(r.respondedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Real-time Notification Popup */}
      {notification && (
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
