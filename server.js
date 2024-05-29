const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
require('dotenv').config();

//import models
const movie_genre = require('./models/movieGenres');
const tv_genre = require('./models/tvGenres')

//Middleware
app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(
  '/semantic',
  express.static(__dirname + 'node_modules/semantic-ui-css')
);

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.API_READ_ACCESS_TOKEN,
  },
};

//GET - Home Page
app.get('/', async (req, res) => {
  //Featured movies today ${day}/ week ${week}
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week`,
      options
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch trending movies');
    }
    featuredMovies = [];

    for (let i = 0; i < 3; i++) {
      featuredMovies.push(response.data.results[i]);
    }
    // res.json(response.data.results);

    res.render('home/index', { featuredMovies });
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  }
});

//Search Page
app.get('/search', (req, res) => {
  res.render('home/search');
});


//Search Results Page
app.get('/search/result', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?query=${req.query.media}&language=en`,
      options
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch trending movies');
    }
const medias = response.data.results;
const movie_genre = movie_genre.genres;
const tv_genre = tv_genre.genres;
const query = req.query.media

    
    res
      .status(200)
      .render('home/show', { medias, movie_genre, tv_genre, query});
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  }
});

// GET - Movie Show Page
app.get('/movie/:id', async (req,res)=>{
try {
const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}`, options);
const imagesResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/images`, options)
const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/videos`, options)
const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/credits`, options)
const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/reviews`, options)
const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/recommendations`, options)



const details = detailsResponse.data;
const images = imagesResponse.data.backdrops;
const videos = videoResponse.data.results;
const credits = creditsResponse.data.cast;
const reviews = reviewsResponse.data.results;
const recommendations = recommendationsResponse.data.results;



  res.render('movie/show', {details, images,videos, credits, reviews, recommendations})
} catch (error) {
  console.error('Error fetching movie', error)
  const { success, status_message } = error.response.data;
  res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
}
})

// GET - TV Show Page
app.get('/tv/:id', async (req,res)=>{
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
  
    res.render('tvShow/show', {details, images, videos, credits, reviews, recommendations})
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  } 
  })

  // GET - Person Show Page
  app.get('/person/:id', async (req,res)=>{
    try {
      const detailsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}`, options);
      const imagesResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/images`, options)
      const movieCreditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/movie_credits`, options)
      const tvCreditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/tv_credits`, options)

      const details = detailsResponse.data;
      const images = imagesResponse.data.profiles;
      const movies = movieCreditsResponse.data.cast;
      const tvShows = tvCreditsResponse.data.cast;

      res.render('person/show', {details, images, movies, tvShows})

    } catch (error) {
      console.error('Error fetching movie', error)
      const { success, status_message } = error.response.data;
      res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
    }
  })

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
