require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({ name: 'Arjun Sharma' });
  console.log("Found", users.length, "users named Arjun Sharma");
  users.forEach(u => {
    console.log(u.email, u._id, "events:", u.eventsRegistered.length);
  });
  process.exit(0);
});
