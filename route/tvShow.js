const express = require('express');
const { getTvShowPage, getTvShowsReviewPage, postTvShowReview, updateTvShowReview, deleteTvShowReview} = require('../controllers/tv')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// @desc GET - TV Show Page
router.get('/:id/:userId', isLoggedIn, getTvShowPage)

// @desc GET - TV Show Review Page
router.get('/:id/reviews/:userId',isLoggedIn, getTvShowsReviewPage);

// @desc POST - Submit a review for a TV Show
router.post('/:id/reviews/:userId', isLoggedIn, postTvShowReview)

// @desc PUT - Update a review for a TV Show
router.put('/:id/reviews/:reviewId', isLoggedIn, updateTvShowReview);

// @desc DELETE - Delete a review for a movie
router.delete('/:id/reviews/:userId', isLoggedIn, deleteTvShowReview);

module.exports = router;