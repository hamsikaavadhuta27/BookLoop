/**
 * User model — prepared for a later phase.
 *
 * Phase 1 does not implement login or signup.
 * Do not use this file to fake authentication.
 *
 * Later you can add:
 * - password hashing (bcrypt)
 * - sessions or JWT
 * - saved books / seller listings
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    location: { type: String, default: 'Hyderabad' },
    savedBookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
