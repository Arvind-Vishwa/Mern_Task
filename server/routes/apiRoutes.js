const express = require('express');
const router = express.Router();
const ensureAuth = require('../middleware/ensureAuth');
const { searchLimiter } = require('../middleware/rateLimiter');
const searchController = require('../controllers/searchController');
const historyController = require('../controllers/historyController');

/**
 * POST /api/search
 * Body: { term }
 * Auth required
 */
router.post('/search', ensureAuth, searchLimiter, searchController.search);

/**
 * GET /api/history
 * Auth required
 */
router.get('/history', ensureAuth, historyController.getHistory);

/**
 * GET /api/top-searches
 * Public (banner) - returns top 5
 */
router.get('/top-searches', historyController.getTopSearches);

module.exports = router;
