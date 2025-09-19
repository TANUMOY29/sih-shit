const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
    full_name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    dob: Date,
    gender: String,
    address: String,
    // Add any other fields from your database here
});

module.exports = mongoose.model('Tourist', touristSchema);