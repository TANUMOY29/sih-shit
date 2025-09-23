const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Itinerary = require('../models/Itinerary');

// @route   POST api/itineraries
// @desc    Create a new itinerary for the logged-in user
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, startDate, endDate, stops } = req.body;

        const newItinerary = new Itinerary({
            tourist: req.tourist.id, // Get the user ID from the auth token
            title,
            startDate,
            endDate,
            stops
        });

        const itinerary = await newItinerary.save();
        res.json(itinerary);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/itineraries
// @desc    Get all itineraries for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Find all itineraries where the 'tourist' field matches the logged-in user's ID
        const itineraries = await Itinerary.find({ tourist: req.tourist.id }).sort({ createdAt: -1 });
        res.json(itineraries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;