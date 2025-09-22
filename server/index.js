const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---
app.get('/', (req, res) => res.send('Travel Shield Backend is running!'));

// Import routes
const aadharRoute = require('./routes/aadhar');
app.use('/api/aadhar', aadharRoute);

const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

const touristRoute = require('./routes/tourists');
app.use('/api/tourists', touristRoute);

app.use('/api/location', require('./routes/location'));


// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ msg: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
