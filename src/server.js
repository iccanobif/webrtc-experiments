const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Route for the streamer.html page
app.get('/streamer', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/streamer.html'));
});

// Route for the listener.html page
app.get('/listener', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/listener.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});