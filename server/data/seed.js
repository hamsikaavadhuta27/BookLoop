require('dotenv').config();

const mongoose = require('mongoose');
const Book = require('../models/Book');
const sampleBooks = require('./sampleBooks');

/**
 * Optional helper: copy sample books into MongoDB.
 * Run: npm run seed
 */
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('Add MONGODB_URI to your .env file first.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  await Book.deleteMany({});
  await Book.insertMany(sampleBooks);
  console.log('Inserted', sampleBooks.length, 'sample books into MongoDB.');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
