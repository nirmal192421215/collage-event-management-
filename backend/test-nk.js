require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const event = await Event.findById('6a1a5f67ae8955693f10d0e6');
  console.log("nk event registrations:", JSON.stringify(event.registrations, null, 2));
  process.exit(0);
});
