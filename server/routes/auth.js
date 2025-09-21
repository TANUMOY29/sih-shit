const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tourist = require('../models/Tourist');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, aadharNumber } = req.body;
        
        let tourist = await Tourist.findOne({ email });
        if (tourist) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        tourist = new Tourist({
            full_name: fullName,
            email,
            password: hashedPassword,
            aadhar_number: aadharNumber
        });

        await tourist.save();

        const payload = { tourist: { id: tourist.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const tourist = await Tourist.findOne({ email });
        if (!tourist) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, tourist.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { tourist: { id: tourist.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;