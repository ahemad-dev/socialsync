const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

// Helper: auth middleware
const getUserId = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

// ✅ Helper to generate unique code
const generateEventCode = () => {
  return "EVT-" + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, country, state, city, venue, date } = req.body;

    // Validation
    if (!title || !description || !country || !state || !city || !venue || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Generate unique eventCode
    let eventCode = generateEventCode();
    let existing = await Event.findOne({ eventCode });
    while (existing) {
      eventCode = generateEventCode();
      existing = await Event.findOne({ eventCode });
    }

    const event = new Event({
      createdBy: userId,
      title,
      description,
      country,
      state,
      city,
      venue,
      date,
      eventCode, // ✅ Save event code
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Error in createEvent:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Events
exports.getEvents = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const events = await Event.find({ createdBy: userId }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("Error in getEvents:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// eventController.js
exports.deleteEvent = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const event = await Event.findOneAndDelete({ _id: id, createdBy: userId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully", event });
  } catch (err) {
    console.error("Error in deleteEvent:", err);
    res.status(500).json({ message: "Server error" });
  }
};
