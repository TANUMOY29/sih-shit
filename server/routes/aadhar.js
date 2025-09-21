const express = require('express');
const router = express.Router();
const AadharRecord = require('../models/AadharRecord');

// This route now correctly handles a POST request from your signup form
router.post('/verify', async (req, res) => {
    try {
        // Look for the aadharNumber in the request body
        const { aadharNumber } = req.body;
        if (!aadharNumber) {
            return res.status(400).json({ msg: 'Aadhar number is required' });
        }

        const record = await AadharRecord.findOne({ aadhar_number: aadharNumber });
        if (!record) {
            return res.status(404).json({ msg: 'Aadhar record not found in our database' });
        }
        
        // If found, send back the record's data
        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;