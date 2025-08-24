const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

// This line tells Express to serve static files from the root directory.
app.use(express.static(path.join(__dirname, '')));


// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Main page server running at http://localhost:${port}`);
});
