const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/smartevents').then(async () => {
  const users = await User.find();
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
});
