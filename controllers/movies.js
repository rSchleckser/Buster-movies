const { User } = require('../models');
const axios = require('axios');
const movie_genre = require('../models/movieGenres');
const  Review  = require('../models/review'); 
const methodOverride = require('method-override');


const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };


  // @desc GET - ALL MOVIES
  const getAllMovies = async (req,res)=>{
    try {
      const trendingResponse = await axios.get(`https://api.themoviedb.org/3/trending/movie/day`, options);
      const nowPlayingResponse = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`, options);
      const popularResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, options)
      const topRatedResponse = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, options)
      const upcomingResponse = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1` ,options)
  
  
      const trendingMovies = trendingResponse.data.results;
      const nowPlayingMovies = nowPlayingResponse.data.results;
      const popularMovies = popularResponse.data.results;
      const topRatedMovies = topRatedResponse.data.results;
      const upcomingMovies = upcomingResponse.data.results;
  ;
      // Mongo User
      const user = await User.findOne({ _id: req.params.userId })
  
    
       res.status(200).render('movie/allMovies', {user, trendingMovies, nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies, movie_genre: movie_genre.genres})
    } catch (error) {
      console.error('Error getting Movies', error);
      res.status(404).render('404');
    }
  }

// ====================================================================================


  // @desc POST - add Movie to watchlist/favorites
  const postMoviesToList = async (req, res) => {
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
  
      res.status(201).redirect(`/movies/${req.params.userId}`);
    } catch (error) {
      console.error('Error adding media to watchlist or favorites', error);
      res.status(404).render('404');
    }
  }


  // ==================================================================================


  // @desc PUT - Remove Movie from watchlist/favorites
  const updateMoviesList = async (req, res) => {
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
  
      res.status(200).redirect(`/movies/${req.params.userId}`);
    } catch (error) {
      console.error('Error removing media from watchlist or favorites', error);
      res.status(404).render('404');
    }
  }


   // ==================================================================================


   //@desc GET - Movie Show Page
   const getMovieShowPage = async (req,res)=>{
    try {
    const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}`, options);
    const whereToWatchResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/watch/providers`, options)
    const imagesResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/images`, options)
    const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/videos`, options)
    const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/credits`, options)
    const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/reviews`, options)
    const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/recommendations`, options)
    
    
    
    const details = detailsResponse.data;
    const whereToWatch = whereToWatchResponse.data.results.US;
    const images = imagesResponse.data.backdrops;
    const videos = videoResponse.data.results;
    const credits = creditsResponse.data.cast;
    const reviews = reviewsResponse.data.results;
    const recommendations = recommendationsResponse.data.results;
    //Mongo Reviews
    const newReviews = await Review.find({movieId: req.params.id})
    // Mongo User
    const user = await User.findOne({ _id: req.params.userId })

    
      res.status(200).render('movie/show', {details, whereToWatch, images,videos, credits, reviews, recommendations, newReviews, user})
    } catch (error) {
      console.error('Error fetching movie', error)
      res.status(404).render('404');
    }
    }


       // ==================================================================================


       // @desc GET - Movie Review Page
       const getMovieReviewPage = async (req,res)=>{
        try {
          const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}`, options);
          const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/reviews`, options)
      
          const details = detailsResponse.data;
          const reviews = reviewsResponse.data.results;
          const user = await User.findOne({ _id: req.params.userId })
          const newReviews = await Review.find({movieId: req.params.id})
         
          res.status(200).render('movie/reviews', {reviews, details, user, newReviews})
        } catch (error) {
          console.error('Error getting review', error);
          res.status(500).send('Server Error');
        }
      }

    // ==================================================================================

      // @desc POST - Submit a review for a movie
      const postMovieReview = async (req, res) => {
        try {
          const newReview = new Review({
            movieId: req.params.id,
            mediaType: 'movie',
            userId: req.params.userId,
            author: req.body.user,
            rating: req.body.rating,
            content: req.body.content,
          });
      
          //Save review in review database
          await newReview.save();
      
          //Save review in user database
          const newComment = await User.findOneAndUpdate(
            {_id: req.params.userId},
            { $push: { reviews: newReview._id } },
            { new: true })
      
          res.status(201).redirect(`/movie/${req.params.id}/reviews/${req.params.userId}`);
        } catch (error) {
          console.error('Error submitting review', error);
          res.status(404).render('404');
        } 
      }


    // ==================================================================================

      // @desc PUT - Update a review for a movie
      const updateMovieReview = async (req, res) => {
        try {
          const user = await Review.findOne({ _id: req.params.reviewId })
          await Review.updateOne({ _id: req.params.reviewId }, { content: req.body.updatedContent });
          res.status(200).redirect(`/movie/${req.params.id}/reviews/${user.userId}`);
        } catch (error) {
          console.error('Error updating Review', error);
          res.status(404).render('404');
        }
      }

    // ==================================================================================

      // @desc DELETE - Delete a review for a movie
      const deleteMovieReview = async (req, res) => {
        try {
          await Review.deleteOne({ _id: req.body.reviewId, movieId: req.params.id });
          res.status(200).redirect(`/movie/${req.params.id}/reviews/${req.params.userId}`);
        } catch (error) {
          console.error('Error deleting Review', error);
          res.status(404).render('404');
        }
      }

  module.exports = {getAllMovies, postMoviesToList, updateMoviesList, getMovieShowPage, getMovieReviewPage, postMovieReview, updateMovieReview, deleteMovieReview}