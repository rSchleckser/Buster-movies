//import models
const { User } = require('../models');


// @desc  GET user profile page
const getProfile = async(req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      const { name, email, phone } = req.user;
      res.status(200).render('profile', { name, email, phone, user });
    } catch (error) {
      console.error('Error getting profile page', error);
      res.status(404).render('404');
    }
  }

  // @desc  GET user Watchlist page
const getWatchlist = async (req,res)=>{
    try {
      const user = await User.findOne({_id: req.params.userId})
      res.status(200).render('userPages/watchlist', {user})
    } catch (error) {
      console.error('Error getting Users watchlist', error)
      res.status(404).render('404');
    }
  }

  //@desc POST - add movies to watchlist/favorites
  const postToWatchList = async (req, res) => {
    try {
  
      const movie = {
        movie: req.body.movie,  
        id: req.body.id,  
        mediaType: req.body.mediaType, 
        releaseDate: req.body.releaseDate ,
        img: req.body.img    
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
  
      res.status(201).redirect(`/profile/${req.params.userId}/watchlist`);
    } catch (error) {
      console.error('Error adding media to watchlist or favorites', error);
      res.status(404).render('404');
    }
  }

  //@desc PUT - Update movies to watchlist/favorites
  const updateWatchList = async (req, res) => {
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
  
      res.status(200).redirect(`/profile/${req.params.userId}/watchlist`);
    } catch (error) {
      console.error('Error removing media from watchlist or favorites', error);
      res.status(404).render('404');
    }
  }





  // @desc  GET user Favorites page
const getFavorites = async (req,res)=>{
    try {
      const user = await User.findOne({_id: req.params.userId});
      res.status(200).render('userPages/favorites', {user})
    } catch (error) {
      console.error('Error getting Users favorites page', error)
      res.status(404).render('404');
    }
  }

  //@desc POST - add movies to watchlist/favorites
  const postToFavoritesList = async (req, res) => {
    try {
  
      const movie = {
        movie: req.body.movie,  
        id: req.body.id,  
        mediaType: req.body.mediaType, 
        releaseDate: req.body.releaseDate ,
        img: req.body.img    
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
  
      res.status(201).redirect(`/profile/${req.params.userId}/favorites`);
    } catch (error) {
      console.error('Error adding media to watchlist or favorites', error);
      res.status(404).render('404');
    }
  }

  //@desc PUT - Update movies to watchlist/favorites
  const updateFavoritesList = async (req, res) => {
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
  
      res.status(200).redirect(`/profile/${req.params.userId}/favorites`);
    } catch (error) {
      console.error('Error removing media from watchlist or favorites', error);
      res.status(404).render('404');
    }
  }





  module.exports ={getProfile, getWatchlist, getFavorites, postToWatchList, updateWatchList, postToFavoritesList, updateFavoritesList}