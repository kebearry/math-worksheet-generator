const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  settings: {
    type: Object,
    required: true
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    gradeLevel: String,
    subject: {
      type: String,
      default: 'Mathematics'
    },
    tags: [String]
  },
  usageStats: {
    timesUsed: {
      type: Number,
      default: 0
    },
    lastUsed: Date,
    ratings: [Number],
    averageRating: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model('Template', templateSchema); 