const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const Job = require('./models/Job');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job_portal_db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected. Seeding...');

  await User.deleteMany({});
  await Job.deleteMany({});

  const pw = await bcrypt.hash('password123', 10);
  const employer = await User.create({ name: 'Demo Employer', email: 'employer@example.com', password: pw, role: 'employer' });
  const seeker = await User.create({ name: 'Demo Seeker', email: 'seeker@example.com', password: pw, role: 'jobseeker' });

  await Job.create([
    { title: 'Frontend Developer', company: 'Acme Co', location: 'Remote', salary: '₹40,000', skills: ['HTML','CSS','JavaScript'], description: 'Build UI', postedBy: employer._id },
    { title: 'Backend Developer', company: 'Beta Labs', location: 'Hyderabad', salary: '₹50,000', skills: ['Node.js','MongoDB'], description: 'API development', postedBy: employer._id }
  ]);

  console.log('Seeded. Users: employer@example.com / seeker@example.com (password123)');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
