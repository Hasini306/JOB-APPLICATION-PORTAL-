const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeUrl: String,
  status: { type: String, enum: ['applied','shortlisted','rejected'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
