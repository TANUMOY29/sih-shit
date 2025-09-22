const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadhar_number: { type: String, required: true, unique: true },
    dob: { type: Date },
    gender: { type: String },
    address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Tourist', touristSchema);

