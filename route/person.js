const express = require('express');
const {getPersonShowPage} = require('../controllers/person')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// @desc GET - Person Show Page
router.get('/:id/:userId', isLoggedIn, getPersonShowPage)

module.exports = router;