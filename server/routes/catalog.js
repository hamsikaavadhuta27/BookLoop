const express = require('express');
const { categories, locations, conditions, years } = require('../data/catalog');

const router = express.Router();

router.get('/categories', (req, res) => {
  res.json({ success: true, data: categories });
});

router.get('/locations', (req, res) => {
  res.json({ success: true, data: locations });
});

router.get('/filters', (req, res) => {
  res.json({
    success: true,
    data: { categories, locations, conditions, years }
  });
});

module.exports = router;
