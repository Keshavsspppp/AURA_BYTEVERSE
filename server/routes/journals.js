const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');

// Get all journals
router.get('/', async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new journal
router.post('/', async (req, res) => {
  try {
    const journal = new Journal({
      content: req.body.content,
      sentiment: req.body.sentiment,
      createdAt: new Date()
    });

    const savedJournal = await journal.save();
    res.status(201).json(savedJournal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;