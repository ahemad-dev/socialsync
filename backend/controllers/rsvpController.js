const Invite = require('../models/Invite');
const Event = require('../models/Event');

exports.getInvite = async (req, res) => {
  try {
    const token = req.params.token;
    const invite = await Invite.findOne({ token }).populate('eventId');
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    // return minimal data for RSVP page
    return res.json({
      inviteId: invite._id,
      email: invite.email,
      status: invite.status,
      event: {
        id: invite.eventId._id,
        title: invite.eventId.title,
        description: invite.eventId.description,
        date: invite.eventId.date,
        venue: invite.eventId.venue,
        city: invite.eventId.city,
        state: invite.eventId.state,
        country: invite.eventId.country
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitResponse = async (req, res) => {
  try {
    const token = req.params.token;
    const { status, comment } = req.body; // status = 'yes' | 'no' | 'maybe'

    if (!['yes', 'no', 'maybe'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    invite.status = status;
    invite.responseComment = comment || '';
    invite.respondedAt = new Date();
    await invite.save();

    // ✅ socket.io emit karega organizer ko
    const io = req.app.get("io"); // jo humne server.js me set kiya
    if (io) {
      io.emit("newResponse", {
        email: invite.email,
        status: invite.status,
        comment: invite.responseComment,
        respondedAt: invite.respondedAt
      });
    }

    return res.json({ message: 'Response recorded', invite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventResponses = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Event check
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Get all invites of this event
    const responses = await Invite.find({ eventId });

    res.json({ event, responses });
  } catch (err) {
    console.error("Error fetching event responses:", err);
    res.status(500).json({ message: "Server error" });
  }
};
