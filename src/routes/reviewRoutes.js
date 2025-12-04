const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');

// Rotas de reviews
router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/game/:gameId', reviewController.getReviewsByGame);
router.get('/game/:gameId/stats', reviewController.getGameStats); // Estatísticas do jogo
router.get('/:id', reviewController.getReviewById);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
