import React, { useEffect, useState } from "react";
import EventForm from "../components/EventForm";
import API from "../api";
import InviteForm from "../components/InviteForm";
import { Link } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";
import { Search, Copy, ChevronDown } from "lucide-react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteEvent, setDeleteEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ Fetch Events
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else if (res.data && Array.isArray(res.data.events)) {
        setEvents(res.data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Delete Event
  const confirmDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => prev.filter((ev) => ev._id !== id));
      setDeleteEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  // ✅ Filter events
  const filteredEvents = events.filter((ev) => {
    if (filterType === "title") {
      return ev.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterType === "code") {
      return ev.eventCode?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // ✅ Copy event code
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Event Card (Reusable Component)
  const EventCard = ({ ev, index }) => (
    <div
      key={ev._id}
      className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow 
      transform transition-all duration-500 ease-out 
      hover:scale-[1.08] hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 animate-fadeInUp"
      style={{ animationDelay: `${index * 0.15 + 1}s` }}
    >
      <h4 className="text-xl font-bold mb-2">{ev.title}</h4>

      {ev.eventCode && (
        <div
          className="flex items-center gap-2 text-sm text-primary mb-3 cursor-pointer hover:text-primaryDark"
          onClick={() => copyCode(ev.eventCode)}
        >
          🔑 {ev.eventCode} <Copy className="w-4 h-4" />
        </div>
      )}

      {ev.description && (
        <p className="text-white/80 text-sm mb-2">{ev.description}</p>
      )}

      {ev.venue && (
        <p className="text-sm">
          📍 <span className="font-medium">{ev.venue}</span>
        </p>
      )}

      <div className="text-sm space-y-1">
        {ev.city && <p>🏙️ {ev.city}</p>}
        {ev.state && (
          <p>
            🗺️ {ev.state}, {ev.country}
          </p>
        )}
      </div>

      {ev.address && <p className="text-sm">🏠 {ev.address}</p>}

      {ev.date && (
        <p className="text-sm mt-2">
          📅 {new Date(ev.date).toLocaleString()}
        </p>
      )}

      <div className="mt-4">
        <InviteForm eventId={ev._id} />
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-3">
        <Link
          to={`/event/${ev._id}/responses`}
          className="flex-1 text-center bg-gradient-to-r from-primary to-primaryDark px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
        >
          View Responses
        </Link>

        <button
          onClick={() => setDeleteEvent(ev)}
          className="flex-1 text-center 
             bg-gradient-to-r from-red-400 to-pink-500 
             px-4 py-2 rounded-lg text-white 
             hover:scale-105 hover:shadow-lg hover:shadow-red-400/30 
             transition-all duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className={`p-6 text-white ${dropdownOpen ? "pointer-events-none" : ""}`}>
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2 animate-fadeInUp">Dashboard</h2>
      <p className="mb-6 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
        Welcome, <strong>{user?.name || "User"}</strong>
      </p>

      {/* ✅ Top Bar with Search + Filter + Counter */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 animate-fadeInUp relative z-20"
        style={{ animationDelay: "0.3s" }}
      >
        {/* Search + Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* ✅ Medium Search Bar */}
          <div className="relative w-[420px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search by ${filterType === "title" ? "Title" : "Event Code"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md 
                         text-white placeholder-white/60 border border-white/20 
                         focus:ring-2 focus:ring-primary focus:border-primary 
                         transition-all duration-300 pointer-events-auto"
            />
          </div>

          {/* ✅ Custom Dropdown */}
          <div className="relative z-[9999]">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white 
                         border border-white/20 focus:ring-2 focus:ring-primary 
                         transition-all duration-300 cursor-pointer relative z-[10000] pointer-events-auto"
            >
              {filterType === "title" ? "Title" : "Event Code"}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full mt-2 w-48 
                           bg-white/10 backdrop-blur-md border border-white/20 
                           rounded-xl shadow-lg z-[10000] animate-fadeInUp pointer-events-auto"
              >
                <div
                  className={`px-4 py-3 cursor-pointer hover:bg-primary/30 transition 
                              ${filterType === "title" ? "text-primary font-semibold" : "text-white"}`}
                  onClick={() => {
                    setFilterType("title");
                    setDropdownOpen(false);
                  }}
                >
                  {filterType === "title" ? "✔ Title" : "Title"}
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer hover:bg-primary/30 transition 
                              ${filterType === "code" ? "text-primary font-semibold" : "text-white"}`}
                  onClick={() => {
                    setFilterType("code");
                    setDropdownOpen(false);
                  }}
                >
                  {filterType === "code" ? "✔ Event Code" : "Event Code"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Total Events */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl shadow flex items-center gap-4 w-fit pointer-events-auto">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/20">
            📊
          </div>
          <div>
            <p className="text-sm text-white/70">Total Events</p>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : events.length}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Search Mode */}
      {searchQuery ? (
        filteredEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pointer-events-auto">
            {filteredEvents.map((ev, index) => (
              <EventCard ev={ev} index={index} key={ev._id} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex justify-center pointer-events-auto">
            <div className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md 
                            text-red-400 border border-red-400/40 shadow-md">
              🚫 No events found for this filter
            </div>
          </div>
        )
      ) : (
        <>
          {/* Event Form */}
          <div className="animate-fadeInUp pointer-events-auto" style={{ animationDelay: "0.6s" }}>
            <EventForm
              onCreated={(newEvent) => setEvents((prev) => [...prev, newEvent])}
            />
          </div>

          {/* Event List */}
          <h3
            className="text-2xl font-semibold mt-8 mb-4 animate-fadeInUp pointer-events-auto"
            style={{ animationDelay: "0.8s" }}
          >
            Your Events
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pointer-events-auto">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : events.length === 0 ? (
              <p className="text-white/70">No events yet. Create one above 👆</p>
            ) : (
              events.map((ev, index) => (
                <EventCard ev={ev} index={index} key={ev._id} />
              ))
            )}
          </div>
        </>
      )}

      {/* ✅ Delete Modal */}
      {deleteEvent && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeInUp"
          onClick={() => setDeleteEvent(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-white/80">
              ⚠️ Are you sure you want to delete{" "}
              <span className="font-semibold text-red-400">
                "{deleteEvent.title}"
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteEvent(null)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 hover:scale-105 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteEvent._id)}
                className="px-4 py-2 rounded-lg 
                           bg-gradient-to-r from-red-400 to-red-600 
                           text-white 
                           hover:scale-105 hover:shadow-lg hover:shadow-red-500/40 
                           transition-all duration-300"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Copy Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 bg-primaryDark text-white px-4 py-2 rounded-lg shadow-lg animate-fadeInUp">
          ✅ Event Code Copied!
        </div>
      )}
    </div>
  );
}
