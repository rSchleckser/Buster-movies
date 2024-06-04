const { User } = require('../models');
const axios = require('axios');
const tv_genre = require('../models/tvGenres');
const  Review  = require('../models/review'); 
const methodOverride = require('method-override');

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };

// @desc GET - ALL TV SHOWS
const getAllTvShows = async (req,res)=>{
    try {
      const trendingResponse = await axios.get(`https://api.themoviedb.org/3/trending/tv/day`,options)
      const airingTodayResponse = await axios.get(`https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1`,options)
      const onAirResponse = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1`,options)
      const popularResponse = await axios.get(`https://api.themoviedb.org/3/tv/popular?language=en-US&page=1`,options)
      const topRatedResponse = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1`,options)
  
      const trendingTv = trendingResponse.data.results;
      const airingToday = airingTodayResponse.data.results;
      const onAir = onAirResponse.data.results;
      const popularTv = popularResponse.data.results;
      const topRatedTv = topRatedResponse.data.results;
      // Mongo User
      const user = await User.findOne({ _id: req.params.userId })
  
  
      res.status(200).render('tvShow/allTvShows',{user, trendingTv, airingToday, onAir, popularTv, topRatedTv, tv_genre: tv_genre.genres})
    } catch (error) {
      console.error('Error getting all tv shows', error)
      res.status(404).render('404');
    }
  }

// ====================================================================================
// @desc POST - add Movie to watchlist/favorites
const postTvShowsList = async (req, res) => {
    try {
      
      const movie = {
        movie: req.body.movie,  
        id: req.body.id,  
        mediaType: req.body.mediaType, 
        releaseDate: req.body.releaseDate,
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
  
      res.status(201).redirect(`/tvShows/${req.params.userId}`);
    } catch (error) {
      console.error('Error adding media to watchlist or favorites', error);
      res.status(404).render('404');
    }
  }

// ====================================================================================
// @desc PUT - Remove Movie from watchlist/favorites
const updateTvShowsList = async (req, res) => {
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
  
      res.status(200).redirect(`/tvShows/${req.params.userId}`);
    } catch (error) {
      console.error('Error removing media from watchlist or favorites', error);
      res.status(404).render('404');
    }
  }

// ====================================================================================
// @desc GET - TV Show Page
const getTvShowPage = async (req,res)=>{
    try {
    const detailsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}`, options);
    const imagesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}/images`, options)
    const videoResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}/videos`, options)
    const creditsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}/credits`, options)
    const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}/reviews`, options)
    const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}/recommendations`, options)
    
    
    
    const details = detailsResponse.data;
    const images = imagesResponse.data.backdrops;
    const videos = videoResponse.data.results;
    const credits = creditsResponse.data.cast;
    const reviews = reviewsResponse.data.results;
    const recommendations = recommendationsResponse.data.results;
    //Mongo Reviews
  const newReviews = await Review.find({movieId: req.params.id})
  // Mongo User
  const user = await User.findOne({ _id: req.params.userId })
    
      res.status(200).render('tvShow/show', {details, images, videos, credits, reviews, recommendations, newReviews, user})
    } catch (error) {
      console.error('Error fetching movie', error)
      res.status(404).render('404');
    } 
    }

// ====================================================================================
// @desc GET - TV Show Review Page
const getTvShowsReviewPage = async (req,res)=>{
    try {
      const detailsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}`, options);
      const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}/reviews`, options)
  
      const details = detailsResponse.data;
      const reviews = reviewsResponse.data.results;
      const user = await User.findOne({ _id: req.params.userId })
      const newReviews = await Review.find({movieId: req.params.id})
     
      res.status(200).render('tvShow/reviews', {reviews, details, user, newReviews})
    } catch (error) {
      console.error('Error getting review', error);
      res.status(404).render('404');
    }
  }

// ====================================================================================
// @desc POST - Submit a review for a TV Show
const postTvShowReview = async (req, res) => {
    try {
      const newReview = new Review({
        movieId: req.params.id,
        mediaType: 'tv',
        userId: req.params.userId,
        author: req.body.user,
        content: req.body.content,
      });
  
      //Save review in review database
      await newReview.save();
  
      //Save review in user database
      const newComment = await User.findOneAndUpdate(
        {_id: req.params.userId},
        { $push: { reviews: newReview._id } },
        { new: true })
  
      
      res.status(201).redirect(`/tv/${req.params.id}/reviews/${req.params.userId}`);
    } catch (error) {
      console.error('Error submitting review', error);
      res.status(404).render('404');
    } 
  }

// ====================================================================================
// @desc PUT - Update a review for a TV Show
const updateTvShowReview = async (req, res) => {
    try {
      const user = await Review.findOne({ _id: req.params.reviewId })
      await Review.updateOne({ _id: req.params.reviewId }, { content: req.body.updatedContent });
      res.status(200).redirect(`/tv/${req.params.id}/reviews/${user.userId}`);
    } catch (error) {
      console.error('Error updating Review', error);
      res.status(404).render('404');
    }
  }

// ====================================================================================
// @desc DELETE - Delete a review for a movie
const deleteTvShowReview = async (req, res) => {
    try {
      const { reviewId } = req.body;  
      await Review.deleteOne({ _id: reviewId, movieId: req.params.id });
      res.status(200).redirect(`/tv/${req.params.id}/reviews/${req.params.userId}`);
    } catch (error) {
      console.error('Error deleting Review', error);
      res.status(404).render('404');
    }
  }


module.exports = {getAllTvShows,postTvShowsList, updateTvShowsList, getTvShowPage, getTvShowsReviewPage, postTvShowReview, updateTvShowReview, deleteTvShowReview}