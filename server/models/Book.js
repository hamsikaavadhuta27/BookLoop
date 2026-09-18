const mongoose = require('mongoose');

/**
 * Book listing stored in MongoDB.
 * Extra fields can be added later without changing the whole app.
 */
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    edition: {
      type: String,
      default: '',
      trim: true
    },
    image: {
      type: String,
      default: '/images/placeholder.svg'
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    branch: {
      type: String,
      default: '',
      trim: true
    },
    year: {
      type: String,
      default: '',
      trim: true
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['Like New', 'Good', 'Fair', 'Acceptable']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least 1']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    seller: {
      name: { type: String, required: true, trim: true },
      email: { type: String, default: '', trim: true },
      contact: { type: String, default: '', trim: true }
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);
