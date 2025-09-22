const mongoose = require('mongoose');

const aadharRecordSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    aadharnumber: { type: String, required: true, unique: true },
    phonenumber: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String },
    address: { type: String },
});

module.exports = mongoose.model('AadharRecord', aadharRecordSchema);