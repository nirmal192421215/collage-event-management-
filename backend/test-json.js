require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const events = await Event.find().select('-paymentQrCode -image').sort({ date: 1 });
  const mappedEvents = events.map(e => {
    const obj = e.toObject();
    obj.id = obj._id.toString();
    if (obj.registrations) {
      obj.registrations = obj.registrations.map(r => {
        r.id = r._id.toString();
        return r;
      });
    }
    return obj;
  });
  
  // Find "nk" event
  const nkEvent = mappedEvents.find(e => e.title === 'nk');
  console.log("nk event registrations:", JSON.stringify(nkEvent.registrations, null, 2));

  // Find "National Tech Symposium" event
  const techEvent = mappedEvents.find(e => e.title.includes('Symposium'));
  console.log("Symposium event registrations:", JSON.stringify(techEvent.registrations, null, 2));

  process.exit(0);
});
