const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expressions: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    emotion: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'],
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    }
  }],
  summary: {
    dominantEmotion: String,
    emotionFrequency: {
      happy: Number,
      sad: Number,
      angry: Number,
      fearful: Number,
      disgusted: Number,
      surprised: Number,
      neutral: Number
    },
    startTime: Date,
    endTime: Date
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);