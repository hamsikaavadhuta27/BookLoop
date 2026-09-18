const Book = require('../models/Book');
const { isDbConnected } = require('../config/db');
const memoryStore = require('../data/memoryStore');
const { conditions } = require('../data/catalog');
const asyncHandler = require('../middleware/asyncHandler');

function toClientBook(book) {
  if (!book) return null;

  const plain = typeof book.toObject === 'function' ? book.toObject() : book;

  return {
    id: String(plain.id || plain._id),
    title: plain.title,
    author: plain.author,
    edition: plain.edition || '',
    image: plain.image || '/images/placeholder.svg',
    category: plain.category,
    branch: plain.branch || '',
    year: plain.year || '',
    condition: plain.condition,
    price: plain.price,
    location: plain.location,
    description: plain.description || '',
    seller: {
      name: plain.seller && plain.seller.name ? plain.seller.name : '',
      email: plain.seller && plain.seller.email ? plain.seller.email : '',
      contact: plain.seller && plain.seller.contact ? plain.seller.contact : ''
    },
    available: plain.available !== false,
    createdAt: plain.createdAt
  };
}

function matchesFilters(book, query) {
  const search = (query.search || query.q || '').toLowerCase().trim();
  const category = (query.category || '').trim();
  const branch = (query.branch || '').trim();
  const year = (query.year || '').trim();
  const location = (query.location || '').trim();
  const condition = (query.condition || '').trim();
  const minPrice = query.minPrice !== undefined && query.minPrice !== '' ? Number(query.minPrice) : null;
  const maxPrice = query.maxPrice !== undefined && query.maxPrice !== '' ? Number(query.maxPrice) : null;

  if (search) {
    const haystack = (book.title + ' ' + book.author).toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  if (category && book.category !== category) return false;
  if (branch && book.branch !== branch) return false;
  if (year && book.year !== year) return false;
  if (location && book.location !== location) return false;
  if (condition && book.condition !== condition) return false;
  if (minPrice !== null && !Number.isNaN(minPrice) && book.price < minPrice) return false;
  if (maxPrice !== null && !Number.isNaN(maxPrice) && book.price > maxPrice) return false;
  return true;
}

function validateBookInput(body, isUpdate) {
  const errors = [];
  const title = (body.title || '').trim();
  const author = (body.author || '').trim();
  const category = (body.category || '').trim();
  const condition = (body.condition || '').trim();
  const location = (body.location || '').trim();
  const price = Number(body.price);
  const sellerName = (body.sellerName || (body.seller && body.seller.name) || '').trim();
  const sellerEmail = (body.sellerEmail || (body.seller && body.seller.email) || '').trim();
  const sellerContact = (body.sellerContact || (body.seller && body.seller.contact) || '').trim();

  if (!isUpdate || body.title !== undefined) {
    if (!title) errors.push('Book name is required');
  }
  if (!isUpdate || body.author !== undefined) {
    if (!author) errors.push('Author is required');
  }
  if (!isUpdate || body.category !== undefined) {
    if (!category) errors.push('Category is required');
  }
  if (!isUpdate || body.condition !== undefined) {
    if (!condition) errors.push('Condition is required');
    else if (!conditions.includes(condition)) errors.push('Choose a valid condition');
  }
  if (!isUpdate || body.location !== undefined) {
    if (!location) errors.push('Location is required');
  }
  if (!isUpdate || body.price !== undefined) {
    if (Number.isNaN(price) || price < 1) errors.push('Enter a valid price of at least ₹1');
  }
  if (!isUpdate || body.sellerName !== undefined || body.seller) {
    if (!sellerName) errors.push('Seller name is required');
  }
  if (sellerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellerEmail)) {
    errors.push('Enter a valid email address');
  }

  return {
    errors,
    data: {
      title,
      author,
      edition: (body.edition || '').trim(),
      image: (body.image || '').trim() || '/images/placeholder.svg',
      category,
      branch: (body.branch || '').trim(),
      year: (body.year || '').trim(),
      condition,
      price,
      location,
      description: (body.description || '').trim(),
      seller: {
        name: sellerName,
        email: sellerEmail,
        contact: sellerContact
      },
      available: body.available !== false && body.available !== 'false'
    }
  };
}

exports.getBooks = asyncHandler(async (req, res) => {
  let list;

  if (isDbConnected()) {
    const docs = await Book.find().sort({ createdAt: -1 });
    list = docs.map(toClientBook);
  } else {
    list = memoryStore.getAll().map(toClientBook);
  }

  const filtered = list.filter((book) => matchesFilters(book, req.query));

  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

exports.getBook = asyncHandler(async (req, res) => {
  let book;

  if (isDbConnected()) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      book = null;
    } else {
      book = await Book.findById(req.params.id);
    }
  } else {
    book = memoryStore.getById(req.params.id);
  }

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }

  res.status(200).json({
    success: true,
    data: toClientBook(book)
  });
});

exports.createBook = asyncHandler(async (req, res) => {
  const { errors, data } = validateBookInput(req.body, false);
  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  let saved;

  if (isDbConnected()) {
    saved = await Book.create(data);
  } else {
    saved = memoryStore.create(data);
  }

  res.status(201).json({
    success: true,
    data: toClientBook(saved)
  });
});

exports.updateBook = asyncHandler(async (req, res) => {
  const { errors, data } = validateBookInput(req.body, true);
  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  let updated;

  if (isDbConnected()) {
    updated = await Book.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
  } else {
    updated = memoryStore.update(req.params.id, data);
  }

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }

  res.status(200).json({
    success: true,
    data: toClientBook(updated)
  });
});

exports.deleteBook = asyncHandler(async (req, res) => {
  let deleted;

  if (isDbConnected()) {
    deleted = await Book.findByIdAndDelete(req.params.id);
  } else {
    deleted = memoryStore.remove(req.params.id);
  }

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Book listing deleted'
  });
});
