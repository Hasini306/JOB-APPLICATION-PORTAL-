const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// list jobs with optional simple query
router.get('/', async (req, res) => {
  const q = req.query.q;
  const filter = {};
  if (q) {
    filter.$or = [
      { title: new RegExp(q, 'i') },
      { company: new RegExp(q, 'i') },
      { skills: new RegExp(q, 'i') }
    ];
  }
  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json(jobs);
});

router.get('/:id', async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

router.post('/', auth, async (req, res) => {
  // only employers can post (simple check)
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Only employers can post jobs' });
  const { title, company, location, salary, skills, description } = req.body;
  const job = new Job({ title, company, location, salary, skills: skills ? skills.split(',').map(s=>s.trim()) : [], description, postedBy: req.user.id });
  await job.save();
  res.json(job);
});

router.put('/:id', auth, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Not found' });
  if (String(job.postedBy) !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
  Object.assign(job, req.body);
  await job.save();
  res.json(job);
});

router.delete('/:id', auth, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Not found' });
  if (String(job.postedBy) !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
  await job.remove();
  res.json({ message: 'Deleted' });
});

module.exports = router;
