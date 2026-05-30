require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({});
  users.forEach(u => {
    console.log(u.email, u.name, "events:", u.eventsRegistered.length);
  });
  process.exit(0);
});
