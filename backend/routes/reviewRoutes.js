/**
 * routes/reviewRoutes.js
 * ───────────────────────
 * Defines all API endpoints.
 */

const express = require('express');
const router = express.Router();
const { predict, getStats, getHistory } = require('../controllers/reviewController');

// POST /api/predict  → Analyze a review
router.post('/predict', predict);

// GET  /api/stats    → Model performance + dataset stats
router.get('/stats', getStats);

// GET  /api/history  → Past predictions from DB
router.get('/history', getHistory);

// GET  /api/health   → Server health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
