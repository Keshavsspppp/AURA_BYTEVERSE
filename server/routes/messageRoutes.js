const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get messages for a specific room
router.get('/room/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new message with file upload support
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const messageData = {
      content: req.body.content,
      roomId: req.body.roomId,
      userId: req.body.userId,
      username: req.body.username
    };

    if (req.file) {
      messageData.fileUrl = `/uploads/${req.file.filename}`;
      messageData.fileType = req.body.fileType;
    }

    const message = new Message(messageData);
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;