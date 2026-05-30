const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  userPhone: String,
  department: String,
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' },
  attended: { type: Boolean, default: false },
  qrCode: String,
  paymentScreenshot: String,
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  shortDescription: String,
  category: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  date: { type: Date, required: true },
  endDate: { type: Date, required: true },
  venue: { type: String, required: true },
  venueAddress: String,
  organizer: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  organizerPhone: String,
  capacity: { type: Number, required: true },
  registeredCount: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  image: String,
  tags: [String],
  registrations: [registrationSchema],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  featured: { type: Boolean, default: false },
  paymentQrCode: String,
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
