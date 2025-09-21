const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    tourist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    status: { type: String, default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);