const express = require('express');
const router = express.Router();
const AadharRecord = require('../models/AadharRecord');

router.post('/verify', async (req, res) => {
    console.log("Received Aadhar verify request:", req.body);
    try {
        const { aadhar_number } = req.body;  // Changed from aadharNumber
        if (!aadhar_number) {
            return res.status(400).json({ msg: 'Aadhar number is required' });
        }

        const record = await AadharRecord.findOne({ aadhar_number: aadhar_number.trim() }); // trim spaces

        if (!record) {
            return res.status(404).json({ msg: 'Aadhar record not found in our database' });
        }

        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
   

});
 module.exports = router;