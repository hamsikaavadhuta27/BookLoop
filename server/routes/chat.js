/**
 * Chat is a future feature.
 * This file only reserves the route shape so later lessons stay organized.
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Chat is not built yet. It will be added in a later phase.'
  });
});

module.exports = router;
