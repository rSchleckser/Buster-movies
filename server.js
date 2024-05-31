const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
require('dotenv').config();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport-config');
const isLoggedIn = require('./middleware/isLoggedIn');
const SECRET_SESSION = process.env.SECRET_SESSION;

//import models
const movie_genre = require('./models/movieGenres');
const tv_genre = require('./models/tvGenres')
const { User } = require('./models');

//Middleware
app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(
  '/semantic',
  express.static(__dirname + 'node_modules/semantic-ui-css')
);

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next(); // going to said route
});

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.API_READ_ACCESS_TOKEN,
  },
};

// ==================================================================================
//GET - Home Page
app.get('/', async (req, res) => {
  //Featured movies today ${day}/ week ${week}
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?language=en`,
      options
    );

const featured = response.data.results;

    res.status(200).render('home/index', { featured });
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  }
});

//import auth routes
app.use('/auth', require('./controllers/auth'));

//GET - Dashboard
app.get('/dashboard', async(req,res)=>{
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?language=en`,
      options
    );

const featured = response.data.results;


    res.status(200).render('dashboard', {featured})
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  }
})

//Go to user profile page
app.get('/profile', isLoggedIn, (req, res) => {
  // res.send(req.user);
  const { name, email, phone } = req.user;
  res.status(200).render('profile', { name, email, phone });
});

//Search Page
app.get('/search', isLoggedIn, (req, res) => {
  res.status(200).render('search/search');
});


//Search Results Page
app.get('/search/results', isLoggedIn, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?query=${req.query.media}&language=en`,
      options
    );


const medias = response.data.results;
const query = req.query.media

    
    res
      .status(200)
      .render('search/show', { medias, movie_genre: movie_genre.genres, tv_genre: tv_genre.genres, query});
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  }
});

// GET - Movie Show Page
app.get('/movie/:id', isLoggedIn, async (req,res)=>{
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



  res.status(200).render('movie/show', {details, images,videos, credits, reviews, recommendations})
} catch (error) {
  console.error('Error fetching movie', error)
  const { success, status_message } = error.response.data;
  res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
}
})

// GET - TV Show Page
app.get('/tv/:id', isLoggedIn, async (req,res)=>{
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
  
    res.status(200).render('tvShow/show', {details, images, videos, credits, reviews, recommendations})
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  } 
  })

  // GET - Person Show Page
  app.get('/person/:id', isLoggedIn, async (req,res)=>{
    try {
      const detailsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}`, options);
      const imagesResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/images`, options)
      const movieCreditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/movie_credits`, options)
      const tvCreditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${req.params.id}/tv_credits`, options)

      const details = detailsResponse.data;
      const images = imagesResponse.data.profiles;
      const movies = movieCreditsResponse.data.cast;
      const tvShows = tvCreditsResponse.data.cast;

      res.status(200).render('person/show', {details, images, movies, tvShows})

    } catch (error) {
      console.error('Error fetching movie', error)
      const { success, status_message } = error.response.data;
      res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
    }
  })

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
