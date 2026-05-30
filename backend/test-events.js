require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const events = await Event.find({}, 'title _id');
  console.log(JSON.stringify(events, null, 2));
  process.exit(0);
});
