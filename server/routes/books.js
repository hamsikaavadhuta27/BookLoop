const express = require('express');
const booksController = require('../controllers/booksController');

const router = express.Router();

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBook);
router.post('/', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);

module.exports = router;
