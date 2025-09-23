const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alerts');

// @route   POST api/alerts
// @desc    Create a new SOS alert
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const newAlert = new Alert({
            tourist_id: req.tourist.id,
            latitude,
            longitude,
        });
        const alert = await newAlert.save();
        res.json(alert);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
