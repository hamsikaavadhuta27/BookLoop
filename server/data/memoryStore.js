const { randomUUID } = require('crypto');
const sampleBooks = require('./sampleBooks');

/**
 * In-memory book list.
 * Used when MongoDB is not connected so the website still works.
 */
let books = [];

function seedMemoryStore() {
  books = sampleBooks.map((book, index) => ({
    ...book,
    id: 'sample-' + (index + 1),
    seller: { ...book.seller },
    createdAt: book.createdAt,
    updatedAt: book.createdAt
  }));
}

function getAll() {
  return books.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getById(id) {
  return books.find((book) => book.id === id) || null;
}

function create(data) {
  const now = new Date();
  const book = {
    id: randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now
  };
  books.unshift(book);
  return book;
}

function update(id, data) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return null;
  books[index] = {
    ...books[index],
    ...data,
    id,
    updatedAt: new Date()
  };
  return books[index];
}

function remove(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return null;
  const [deleted] = books.splice(index, 1);
  return deleted;
}

module.exports = {
  seedMemoryStore,
  getAll,
  getById,
  create,
  update,
  remove
};
