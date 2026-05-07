const express = require('express');
const RecommendationController = require('../controllers/recommendationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get content-based recommendations for a specific course
router.get('/course/:courseId', RecommendationController.getRecommendations);

// Get personalized recommendations for logged-in user (simple popularity)
router.get('/personalized', auth, RecommendationController.getPersonalizedRecommendations);

module.exports = router;