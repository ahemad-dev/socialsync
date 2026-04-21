const express = require("express");
const router = express.Router();

// 👇 Add this
const eventController = require("../controllers/eventController");

// Routes
router.get("/", eventController.getEvents);
router.post("/", eventController.createEvent);
router.delete("/:id", eventController.deleteEvent); // ✅ Delete route

module.exports = router;
