const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Travel Shield Backend is running!');
});
app.use('/api/aadhar', require('./routes/aadhar'));

app.use('/api/auth', require('./routes/auth'));
// We will add more routes here for profile, alerts, etc.

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});