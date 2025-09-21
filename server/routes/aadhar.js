const express = require('express');
const router = express.Router();
const AadharRecord = require('../models/AadharRecord');

// This route finds an Aadhar record by number
router.get('/:aadharNumber', async (req, res) => {
    try {
        const record = await AadharRecord.findOne({ aadhar_number: req.params.aadharNumber });
        if (!record) {
            return res.status(404).json({ msg: 'Aadhar record not found' });
        }
        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
