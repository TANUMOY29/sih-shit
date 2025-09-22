const express = require('express');
const Tourist = require('../models/Tourist');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Protected "me" route
router.get('/me', async (req, res) => {
  try {
    // Expect JWT in headers
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find tourist by ID from token
    const tourist = await Tourist.findById(decoded.tourist.id).select('-password');
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    res.json(tourist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
