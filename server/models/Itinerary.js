const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    tourist: {
        type: mongoose.Schema.Types.ObjectId, // This is the link to the Tourist
        ref: 'Tourist', // This tells Mongoose the link is to the 'Tourist' model
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    stops: [{ // This is an array of strings for the places they will visit
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);