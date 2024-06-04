const express = require('express');
const {getDashboard} = require('../controllers/dashboard')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// @desc  GET user Dashboard page
router.get('/dashboard/:id', isLoggedIn, getDashboard)

module.exports = router;