const express = require('express');
const {getAllMovies, postMoviesToList, updateMoviesList } = require('../controllers/movies')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();


  // @desc GET - ALL MOVIES
  router.get('/:userId', isLoggedIn, getAllMovies)
  // @desc POST - add Movie to watchlist/favorites
  router.post('/:userId', isLoggedIn, postMoviesToList);
  // @desc PUT - Remove Movie from watchlist/favorites
  router.put('/:userId', isLoggedIn, updateMoviesList);

  module.exports = router;