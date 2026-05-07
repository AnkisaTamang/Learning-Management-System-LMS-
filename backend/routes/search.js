const express = require('express');
const SearchController = require('../controllers/searchController');

const router = express.Router();

// Advanced search endpoint
router.get('/', SearchController.search);

// Auto-complete suggestions
router.get('/suggestions', SearchController.suggestions);

module.exports = router;