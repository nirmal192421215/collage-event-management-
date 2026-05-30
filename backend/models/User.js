const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin', 'faculty'], default: 'student' },
  avatar: String,
  department: String,
  year: String,
  rollNumber: String,
  phone: String,
  joinedAt: { type: Date, default: Date.now },
  eventsRegistered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  eventsAttended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

module.exports = mongoose.model('User', userSchema);
