const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// A simple "Hello World" route to test if the server is working
app.get('/', (req, res) => {
  res.send('Hello from the Travel Shield Backend!');
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});