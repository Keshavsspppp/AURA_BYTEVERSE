const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Message = require('../models/Message');

// Create room
router.post('/', async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    const room = new Room({
      name,
      createdBy
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to your existing roomRoutes.js
router.delete('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Delete all messages in the room
    await Message.deleteMany({ roomId });
    
    // Delete the room
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    
    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
});
module.exports = router;