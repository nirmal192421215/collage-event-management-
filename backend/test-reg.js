require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const users = await User.find();
    if (users.length === 0) return process.exit(1);
    const user = users[0];
    
    const events = await Event.find();
    if (events.length === 0) return process.exit(1);
    const event = events[0];

    console.log("Before Registration:");
    console.log("User events:", user.eventsRegistered);
    console.log("Event registrations:", event.registrations);

    const userId = user._id.toString();
    const eventId = event._id.toString();

    // simulate backend logic
    const existing = event.registrations.find(r => r.userId.toString() === userId);
    if (!existing) {
      event.registrations.push({
        userId, userName: user.name, userEmail: user.email
      });
      event.registeredCount += 1;
      await event.save();
      await User.findByIdAndUpdate(userId, { $addToSet: { eventsRegistered: event._id } });
    }

    const updatedUser = await User.findById(userId);
    const updatedEvent = await Event.findById(eventId);
    console.log("\nAfter Registration:");
    console.log("User events:", updatedUser.eventsRegistered);
    console.log("Event registrations:", updatedEvent.registrations);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
