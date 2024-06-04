const { User } = require('../models');
const axios = require('axios');

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };

// @desc  GET user Dashboard page
const getDashboard = async(req,res)=>{
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/all/week?language=en`,
        options
      );
      const user = await User.findOne({ _id: req.params.id })
      const featured = response.data.results;
  
      res.status(200).render('dashboard', {featured, user})
    } catch (error) {
      console.error('Error fetching movie', error)
      res.status(404).render('404');
    }
  }

  module.exports = {getDashboard}