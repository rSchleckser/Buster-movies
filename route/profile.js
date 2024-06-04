const express = require('express');
const {getProfile, getWatchlist, getFavorites} = require('../controllers/profile')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// @desc  GET user profile page
router.get('/:userId', isLoggedIn, getProfile);

// @desc  GET user Watchlist page
router.get('/:userId/watchlist', isLoggedIn, getWatchlist);

// @desc  GET user Favorites page
router.get('/:userId/favorites', isLoggedIn, getFavorites)

module.exports = router;