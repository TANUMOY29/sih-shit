const express = require('express');
const router = express.Router();
const auth = require('../routes/auth');
const LocationHistory = require('../models/LocationHistory');

// @route   POST api/location
// @desc    Save a user's location point
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const newLocation = new LocationHistory({
            tourist: req.tourist.id,
            latitude,
            longitude
        });

        const location = await newLocation.save();
        res.json(location);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
