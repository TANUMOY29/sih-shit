const express = require('express');
const router = express.Router();
const AadharRecord = require('../models/AadharRecord'); // Make sure this exists

// POST /api/aadhar/verify
router.post('/verify', async (req, res) => {
    try {
        const { aadhar_number } = req.body;
        if (!aadhar_number) {
            return res.status(400).json({ msg: 'Aadhar number is required' });
        }

        // Trim spaces
        const record = await AadharRecord.findOne({ aadhar_number: aadhar_number.trim() });

        if (!record) {
            return res.status(404).json({ msg: 'Aadhar record not found in our database' });
        }

        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
