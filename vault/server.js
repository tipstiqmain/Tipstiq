const express = require('express');
const path = require('path');

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, 'frontend')));

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});

process.on('SIGINT', () => {
  console.log('\nCaught interrupt signal. Shutting down...');
  server.close(() => {
    console.log('Server has been closed.');
    process.exit(0);
  });
});
