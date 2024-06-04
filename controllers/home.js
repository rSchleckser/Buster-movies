const { User } = require('../models');
const axios = require('axios');

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };

    // @desc GET - Home Page
    const getHomePage = async (req, res) => {
        //Featured movies today ${day}/ week ${week}
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/trending/all/week?language=en`,
            options
          );
          const featured = response.data.results;
      
          res.status(200).render('home/index', { featured });
        } catch (error) {
          res.status(404).render('404');
        }
      }

      module.exports = {getHomePage}