const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Event = require('./models/Event');

const MOCK_USERS = [
  {
    name: 'Arjun Sharma',
    email: 'student@college.edu',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    rollNumber: 'CS21-045',
    phone: '+91 98765 43210',
  },
  {
    name: 'Dr. Ramesh Kumar',
    email: 'admin@college.edu',
    role: 'admin',
    department: 'Event Management Cell',
  },
  {
    name: 'Prof. Anjali Desai',
    email: 'faculty@college.edu',
    role: 'faculty',
    department: 'Computer Science',
  },
];

const MOCK_EVENTS = [
  {
    title: 'National Tech Symposium 2025',
    description: 'A grand gathering of technology enthusiasts, industry leaders, and innovative minds.',
    shortDescription: 'Grand tech gathering with industry leaders & AI/ML insights.',
    category: 'Technology',
    status: 'upcoming',
    date: new Date('2025-07-15T09:00:00.000Z'),
    endDate: new Date('2025-07-16T18:00:00.000Z'),
    venue: 'Main Auditorium, Block A',
    venueAddress: 'Sri Venkateswara College of Engineering, Chennai',
    organizer: 'Tech Club',
    organizerEmail: 'techclub@college.edu',
    capacity: 500,
    price: 0,
    tags: ['AI', 'ML', 'Cloud', 'Networking'],
    featured: true,
  },
  {
    title: 'Cultural Fiesta — Utsav 2025',
    description: 'The most awaited annual cultural festival featuring dance performances, music competitions, drama, art exhibitions, and fashion show.',
    shortDescription: 'Annual cultural festival with dance, music, drama & art.',
    category: 'Cultural',
    status: 'upcoming',
    date: new Date('2025-08-02T10:00:00.000Z'),
    endDate: new Date('2025-08-03T21:00:00.000Z'),
    venue: 'Open Air Theatre',
    organizer: 'Cultural Committee',
    organizerEmail: 'cultural@college.edu',
    capacity: 1000,
    price: 150,
    tags: ['Dance', 'Music', 'Drama', 'Art'],
    featured: true,
  }
];

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartevents';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  await User.deleteMany({});
  await Event.deleteMany({});
  
  await User.insertMany(MOCK_USERS);
  await Event.insertMany(MOCK_EVENTS);

  console.log('Successfully seeded database with demo users and events!');
  process.exit();
}

seed();
