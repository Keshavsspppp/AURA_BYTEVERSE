const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sentiment: {
    score: Number,
    mood: String,
    recommendations: {
      title: String,
      activities: [String]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journal', journalSchema);