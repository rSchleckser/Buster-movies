const { User } = require('../models');
const axios = require('axios');


const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };

  
  
  // @desc GET - Person Show Page
  const getPersonShowPage = async (req,res)=>{
    try {
      const detailsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}`, options);
      const imagesResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/images`, options)
      const movieCreditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/movie_credits`, options)
      const tvCreditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/tv_credits`, options)

      const details = detailsResponse.data;
      const images = imagesResponse.data.profiles;
      const movies = movieCreditsResponse.data.cast;
      const tvShows = tvCreditsResponse.data.cast;
      // Mongo User
      const user = await User.findOne({ _id: req.params.userId })

      res.status(200).render('person/show', {details, images, movies, tvShows, user})

    } catch (error) {
      console.error('Error fetching movie', error)
      res.status(404).render('404');
    }
  }

  module.exports = {getPersonShowPage}