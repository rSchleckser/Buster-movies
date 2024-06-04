const express = require('express');
const {getAllTvShows,postTvShowsList, updateTvShowsList} = require('../controllers/tv')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();


// @desc GET - ALL TV SHOWS
router.get('/:userId', isLoggedIn, getAllTvShows)

// @desc POST - add Movie to watchlist/favorites
router.post('/:userId', isLoggedIn, postTvShowsList)

// @desc PUT - Remove Movie from watchlist/favorites
router.put('/:userId', isLoggedIn, updateTvShowsList);

module.exports = router;