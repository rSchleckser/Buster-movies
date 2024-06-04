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





  module.exports ={getProfile, getWatchlist, getFavorites }