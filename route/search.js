const express = require('express');
const {getSearchResults, postToSearchList, updateSearchList } = require('../controllers/search')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();


// @desc  GET user search results page
router.get('/:userId/results', isLoggedIn, getSearchResults);

//@desc POST - add movies to watchlist/favorites
router.post('/:userId/results', isLoggedIn, postToSearchList);

//@desc PUT - Update movies to watchlist/favorites
router.put('/:userId/results', isLoggedIn, updateSearchList);

module.exports = router;