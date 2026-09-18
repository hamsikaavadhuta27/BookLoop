const mongoose = require('mongoose');
const Book = require('../models/Book');
const sampleBooks = require('../data/sampleBooks');

/**
 * Connect to MongoDB using MONGODB_URI from .env
 *
 * If the URI is missing or MongoDB is not running, BookLoop still starts.
 * Book data then lives in memory (see server/data/memoryStore.js).
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('No MONGODB_URI found. Using in-memory book data.');
    console.log('Copy .env.example to .env when you are ready to use MongoDB.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany(sampleBooks);
      console.log('Added sample books to MongoDB (database was empty).');
    }
    return true;
  } catch (error) {
    console.log('Could not connect to MongoDB. Using in-memory book data instead.');
    console.log('Reason:', error.message);
    return false;
  }
}

function isDbConnected() {
  // 1 means connected
  return mongoose.connection.readyState === 1;
}

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
