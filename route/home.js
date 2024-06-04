const express = require('express');
const {getHomePage} = require('./controllers/home')
const router = express.Router();

 // @desc GET - Home Page
 router.get('/', getHomePage)

 module.exports = router;
