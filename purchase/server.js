import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 9000; // Internal port for the container

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval'");
  next();
});

app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
  console.log(`Purchase app listening at http://localhost:${port}`);
});