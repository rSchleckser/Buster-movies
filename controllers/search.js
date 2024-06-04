const { User } = require('../models');
const axios = require('axios');
const movie_genre = require('../models/movieGenres');
const tv_genre = require('../models/tvGenres')

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };



// @desc  GET user search results page
const getSearchResults = async (req, res) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?query=${req.query.media}&language=en`,
        options
      );
  
     const medias = response.data.results;
     const query = req.query.media
     // Mongo User
     const user = await User.findOne({ _id: req.params.userId })
  
    res
    .status(200)
    .render('search/show', { medias, movie_genre: movie_genre.genres, tv_genre: tv_genre.genres, query, user});
  
    } catch (error) {
      console.error('Error fetching movie', error)
      res.status(404).render('404');
    }
  }

  //@desc POST - add movies to watchlist/favorites
  const postToSearchList = async (req, res) => {
    try {
  
      const movie = {
        movie: req.body.movie,  
        id: req.body.id,  
        mediaType: req.body.mediaType, 
        releaseDate: req.body.releaseDate     
      };
  
      if (req.body.watchlist) {
        await User.findByIdAndUpdate(
          req.params.userId,
          { $push: { watchlist: movie } }, 
          { new: true }
        );
      } else if (req.body.favorite) {
        await User.findByIdAndUpdate(
          req.params.userId,
          { $push: { favorites: movie } }, 
          { new: true }
        );
      }
  
      res.status(201).redirect(`/search/${req.params.userId}/results?media=${encodeURIComponent(req.body.query)}`);
    } catch (error) {
      console.error('Error adding media to watchlist or favorites', error);
      res.status(404).render('404');
    }
  }

    //@desc PUT - Update movies to watchlist/favorites
    const updateSearchList = async (req, res) => {
        try {
          if (req.body.favorite) {
            await User.findByIdAndUpdate(
              req.params.userId,
              { $pull: { favorites: { id: req.body.movieId } } },  
              { new: true }
            );
          } else if (req.body.watchlist) {
            await User.findByIdAndUpdate(
              req.params.userId,
              { $pull: { watchlist: { id: req.body.movieId } } },  
              { new: true }
            );
          }
      
          res.status(200).redirect(`/search/${req.params.userId}/results?media=${encodeURIComponent(req.body.query)}`);
        } catch (error) {
          console.error('Error removing media from watchlist or favorites', error);
          res.status(404).render('404');
        }
      }

  module.exports = {getSearchResults, postToSearchList, updateSearchList }