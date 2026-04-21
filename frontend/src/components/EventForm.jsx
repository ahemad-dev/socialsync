import React, { useState } from "react";
import API from "../api";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const venueList = {
  "IN-GJ-Dhoraji": ["Bhagvati School", "Town Hall", "Mandir Hall"],
  "IN-GJ-Rajkot": ["Crystal Hall", "Saurashtra University", "Race Course Ground"],
  "US-CA-San Francisco": ["Moscone Center", "Golden Gate Park", "Tech Hub"],
};

export default function EventForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    country: "",
    state: "",
    city: "",
    venue: "",
    customVenue: "",
  });
  const [msg, setMsg] = useState(null);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [dateTime, setDateTime] = useState(null);

  // ✅ react-select custom styles
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderColor: "rgba(255,255,255,0.3)",
      color: "white",
      padding: "2px",
    }),
    singleValue: (base) => ({ ...base, color: "white" }),
    input: (base) => ({ ...base, color: "white" }),
    placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.7)" }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1e293b",
      color: "white",
      zIndex: 9999, // 👈 menu upar rahe
      position: "relative",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#3b82f6" : "#1e293b",
      color: "white",
      cursor: "pointer",
    }),
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Submit event
  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) return setMsg({ type: "error", text: "Title is required" });
    if (!form.description) return setMsg({ type: "error", text: "Description is required" });
    if (!country) return setMsg({ type: "error", text: "Country is required" });
    if (!state) return setMsg({ type: "error", text: "State is required" });
    if (!form.city) return setMsg({ type: "error", text: "City is required" });
    if (!form.venue) return setMsg({ type: "error", text: "Venue is required" });
    if (form.venue === "custom" && !form.customVenue)
      return setMsg({ type: "error", text: "Custom Venue is required" });
    if (!form.date) return setMsg({ type: "error", text: "Date & Time is required" });

    try {
      const finalVenue = form.venue === "custom" ? form.customVenue : form.venue;

      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        country: country?.name || "",
        state: state?.name || "",
        city: form.city,
        venue: finalVenue,
      };

      const token = localStorage.getItem("token");
      const res = await API.post("/events", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg({ type: "success", text: "✅ Event created successfully 🎉" });
      setForm({
        title: "",
        description: "",
        date: "",
        country: "",
        state: "",
        city: "",
        venue: "",
        customVenue: "",
      });
      setCountry(null);
      setState(null);
      setDateTime(null);
      onCreated(res.data);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "❌ Error creating event",
      });
    }
  };

  // Venue key generate
  const venueKey = `${country?.isoCode || ""}-${state?.isoCode || ""}-${form.city || ""}`;
  const venues = venueList[venueKey] || [];

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg mb-6 relative">
      <h3 className="text-xl font-semibold text-white mb-4">Create Event</h3>

      {msg && (
        <div
          className={`p-3 mb-3 rounded text-sm font-medium ${
            msg.type === "success"
              ? "bg-green-500/20 text-green-100 border border-green-400/50"
              : "bg-red-500/20 text-red-100 border border-red-400/50"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Event title"
          className="w-full p-3 rounded bg-white/10 text-white placeholder-gray-300 border border-white/20"
        />

        {/* Description */}
        <input
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Description"
          className="w-full p-3 rounded bg-white/10 text-white placeholder-gray-300 border border-white/20"
        />

        {/* Country */}
        <Select
          menuPortalTarget={document.body} // 👈 fix dropdown overlap
          styles={{ ...selectStyles, menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          options={Country.getAllCountries().map((c) => ({
            value: c.isoCode,
            label: c.name,
          }))}
          value={country ? { value: country.isoCode, label: country.name } : null}
          onChange={(selected) => {
            const selectedCountry = Country.getAllCountries().find(
              (c) => c.isoCode === selected.value
            );
            setCountry(selectedCountry);
            setState(null);
            setForm({ ...form, country: selectedCountry?.name || "", state: "", city: "", venue: "" });
          }}
          placeholder="Select Country"
        />

        {/* State */}
        <Select
          menuPortalTarget={document.body}
          styles={{ ...selectStyles, menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          options={
            country
              ? State.getStatesOfCountry(country.isoCode).map((s) => ({
                  value: s.isoCode,
                  label: s.name,
                }))
              : []
          }
          value={state ? { value: state.isoCode, label: state.name } : null}
          onChange={(selected) => {
            const selectedState = State.getStatesOfCountry(country?.isoCode).find(
              (s) => s.isoCode === selected.value
            );
            setState(selectedState);
            setForm({ ...form, state: selectedState?.name || "", city: "", venue: "" });
          }}
          placeholder="Select State"
          isDisabled={!country}
        />

        {/* City */}
        <Select
          menuPortalTarget={document.body}
          styles={{ ...selectStyles, menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          options={
            state
              ? City.getCitiesOfState(country?.isoCode, state?.isoCode).map((c) => ({
                  value: c.name,
                  label: c.name,
                }))
              : []
          }
          value={form.city ? { value: form.city, label: form.city } : null}
          onChange={(selected) => setForm({ ...form, city: selected.value, venue: "" })}
          placeholder="Select City"
          isDisabled={!state}
        />

        {/* Venue */}
        {form.city && (
          <Select
            menuPortalTarget={document.body}
            styles={{ ...selectStyles, menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            options={[
              ...venues.map((v) => ({ value: v, label: v })),
              { value: "custom", label: "Other (Enter manually)" },
            ]}
            value={form.venue ? { value: form.venue, label: form.venue } : null}
            onChange={(selected) => setForm({ ...form, venue: selected.value })}
            placeholder="Select Venue"
          />
        )}

        {/* Custom Venue */}
        {form.venue === "custom" && (
          <input
            name="customVenue"
            value={form.customVenue}
            onChange={onChange}
            placeholder="Enter custom venue"
            className="w-full p-3 rounded bg-white/10 text-white placeholder-gray-300 border border-white/20"
          />
        )}

        {/* Date & Time */}
        <DatePicker
          selected={dateTime}
          onChange={(dt) => {
            setDateTime(dt);
            setForm({ ...form, date: dt });
          }}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="dd-MM-yyyy h:mm aa"
          placeholderText="Select date & time"
          className="w-full p-3 rounded bg-white/10 text-white placeholder-gray-300 border border-white/20"
          popperClassName="z-[9999]" // 👈 Datepicker popup fix
          portalId="root-portal" // 👈 React portal fix
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primaryDark hover:opacity-90 text-white py-3 rounded-lg shadow-lg"
        >
          Create
        </button>
      </form>
    </div>
  );
}
