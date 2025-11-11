const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function(req, file, cb) {
    const unique = Date.now() + '-' + file.originalname.replace(/\s+/g,'-');
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.post('/:jobId', auth, upload.single('resume'), async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const resumeUrl = req.file ? '/uploads/' + req.file.filename : '';
  const application = new Application({ job: job._id, user: req.user.id, resumeUrl });
  await application.save();
  res.json({ message: 'Applied', application });
});

module.exports = router;
