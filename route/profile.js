const express = require('express');
const {getProfile, getWatchlist, getFavorites, postToFavoritesList, updateFavoritesList, postToWatchList, updateWatchList } = require('../controllers/profile')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// @desc  GET user profile page
router.get('/:userId', isLoggedIn, getProfile);

// @desc  GET user Watchlist page
router.get('/:userId/watchlist', isLoggedIn, getWatchlist);

// @desc  POST to user watchlist page
router.post('/:userId/watchlist', isLoggedIn, postToWatchList);

// @desc  PUT remove watchlist from watchlist page
router.put('/:userId/watchlist', isLoggedIn, updateWatchList)

// @desc  GET user Favorites page
router.get('/:userId/favorites', isLoggedIn, getFavorites);

// @desc  POST to user Favorites page
router.post('/:userId/favorites', isLoggedIn, postToFavoritesList );

// @desc  PUT remove Favorites from favorites page
router.put('/:userId/favorites', isLoggedIn, updateFavoritesList )

module.exports = router;