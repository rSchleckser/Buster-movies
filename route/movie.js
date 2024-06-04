const express = require('express');
const { getMovieShowPage, getMovieReviewPage, postMovieReview, updateMovieReview, deleteMovieReview } = require('../controllers/movies')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();
  

  //@desc GET - Movie Show Page
  router.get('/:id/:userId', isLoggedIn, getMovieShowPage);
  // @desc GET - Movie Review Page
  router.get('/:id/reviews/:userId', isLoggedIn, getMovieReviewPage);
  // @desc POST - Submit a review for a movie
  router.post('/:id/reviews/:userId', isLoggedIn, postMovieReview)
  // @desc PUT - Update a review for a movie
  router.put('/:id/reviews/:reviewId', isLoggedIn, updateMovieReview);
  // @desc DELETE - Delete a review for a movie
  router.delete('/:id/reviews/:userId', isLoggedIn, deleteMovieReview);

  module.exports = router;