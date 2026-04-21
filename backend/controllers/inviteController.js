const { v4: uuidv4 } = require("uuid");
const Invite = require("../models/Invite");
const Event = require("../models/Event");
const { sendEmail } = require("../utils/sendEmail"); // ✅ yaha change
const jwt = require("jsonwebtoken");

// Helper: get userId from token
const getUserId = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null;
  }
};

// POST /api/events/:id/invite
exports.sendInvites = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const eventId = req.params.id;
    const { emails } = req.body; // expect array of emails

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res
        .status(400)
        .json({ message: "Provide at least one valid email" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (String(event.createdBy) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const results = [];

    for (const email of emails) {
      const token = uuidv4();

      // Save invite
      const invite = new Invite({
        eventId,
        email,
        token,
        sentAt: new Date(),
      });
      await invite.save();

      // RSVP link
      const rsvpUrl = `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/rsvp/${token}`;

      // Email HTML
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 16px; color:#333;">
          <h2>You're invited to <span style="color:#09D1C7;">${event.title}</span></h2>
          <p>${event.description || ""}</p>
          <p><strong>📅 When:</strong> ${new Date(
            event.date
          ).toLocaleString()}</p>
          <p><strong>📍 Where:</strong> ${
            event.venue || event.location || "TBA"
          }</p>
          <br/>
          <a href="${rsvpUrl}" 
             style="display:inline-block;padding:12px 20px;background:#09D1C7;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
             View & RSVP
          </a>
          <p style="font-size:12px;color:#888;margin-top:10px;">
            If the button doesn’t work, copy this link: <br/> ${rsvpUrl}
          </p>
        </div>
      `;

      // ✅ Email bhejna
      const info = await sendEmail({
        to: email,
        subject: `You're invited: ${event.title}`,
        html,
      });

      results.push({
        email,
        inviteId: invite._id,
        preview: info.preview || null,
      });
    }

    return res.json({
      message: `Invites sent: ${results.length}`,
      results,
    });
  } catch (err) {
    console.error("Error in sendInvites", err);
    return res.status(500).json({ message: "Server error" });
  }
};
