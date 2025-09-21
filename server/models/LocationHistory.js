const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
    tourist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } }); // Only need createdAt

module.exports = mongoose.model('LocationHistory', locationHistorySchema);