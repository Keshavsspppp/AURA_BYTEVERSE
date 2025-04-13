const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// Create a new report or update existing one
router.post('/', auth, async (req, res) => {
  try {
    const { emotion, confidence } = req.body;
    
    // Find the most recent report from today for this user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let report = await Report.findOne({
      userId: req.user.id,
      'summary.startTime': { $gte: today }
    });

    if (!report) {
      // Create new report if none exists for today
      report = new Report({
        userId: req.user.id,
        expressions: [],
        summary: {
          emotionFrequency: {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            surprised: 0,
            neutral: 0
          },
          startTime: new Date(),
          endTime: new Date()
        }
      });
    }

    // Add new expression
    report.expressions.push({
      emotion,
      confidence,
      timestamp: new Date()
    });

    // Update summary
    report.summary.emotionFrequency[emotion]++;
    report.summary.endTime = new Date();

    // Calculate dominant emotion
    const frequencies = report.summary.emotionFrequency;
    report.summary.dominantEmotion = Object.keys(frequencies)
      .reduce((a, b) => frequencies[a] > frequencies[b] ? a : b);

    await report.save();
    res.json(report);
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reports
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;