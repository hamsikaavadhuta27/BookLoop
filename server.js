//Load environment variables from .env (if the file exists)
require('dotenv').config();

const path = require('path');
const express = require('express');

const connectDB = require('./server/config/db');
const bookRoutes = require('./server/routes/books');
const catalogRoutes = require('./server/routes/catalog');
const errorHandler = require('./server/middleware/errorHandler');
const { seedMemoryStore } = require('./server/data/memoryStore');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (needed for POST /api/books)
// 2mb limit so a small book photo can be sent as a data URL
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS, JS, and images from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BookLoop API is running',
    database: require('mongoose').connection.readyState === 1 ? 'mongodb' : 'memory'
  });
});

app.use('/api/books', bookRoutes);
app.use('/api', catalogRoutes);

// Unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Unknown pages (not an API request)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use(errorHandler);

async function start() {
  // Try MongoDB first. If it is not available, the app still works
  // using an in-memory list of sample books.
  await connectDB();
  seedMemoryStore();

  app.listen(PORT, () => {
    console.log('');
    console.log('  BookLoop is running');
    console.log('  Open: http://localhost:' + PORT);
    console.log('');
  });
}

start();
