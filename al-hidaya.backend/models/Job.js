const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time'
  },
  salary: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  requirements: [String],
  responsibilities: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);