const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending','yes','no','maybe'], default: 'pending' },
  sentAt: { type: Date },
  respondedAt: { type: Date },
  responseComment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Invite', inviteSchema);
