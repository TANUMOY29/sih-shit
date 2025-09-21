const mongoose = require('mongoose');

const aadharRecordSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    aadhar_number: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String },
    address: { type: String },
});

module.exports = mongoose.model('AadharRecord', aadharRecordSchema);
