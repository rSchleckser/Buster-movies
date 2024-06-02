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
const mongoose = require('mongoose')


//import models
const movie_genre = require('./models/movieGenres');
const tv_genre = require('./models/tvGenres')
const { User } = require('./models');
const  Review  = require('./models/review'); 

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
app.get('/dashboard/:id', async(req,res)=>{
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?language=en`,
      options
    );
    User.findOne({ _id: req.params.id })
    .then((user)=>{
  
    const featured = response.data.results;
    res.status(200).render('dashboard', {featured, user})
    })

  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  }
})

//Go to user profile page
app.get('/profile/:id', isLoggedIn, (req, res) => {

  User.findOne({ _id: req.params.id })
    .then((user)=>{
      console.log(user._id.toString())

      const { name, email, phone } = req.user;
      res.status(200).render('profile', { name, email, phone, user });
    })
});

//GET - Go to user watchlist page
app.get('/profile/watchlist', (req,res)=>{
  User.findOne({name:'Richard Schleckser'})
  .then(user =>{
    res.render('userPages/watchlist', {user})
  })
  
})

// ================================== Search Pages ===================================

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

User.findOne({name:'Richard Schleckser'})
.then((user)=>{
  res
  .status(200)
  .render('search/show', { medias, movie_genre: movie_genre.genres, tv_genre: tv_genre.genres, query, user});
})
  } catch (error) {
    console.error('Error fetching movie', error)
    const { success, status_message } = error.response.data;
    res.status(500).send(`Error fetching movie <br> ${error} <br> Able to retrieve data from API: ${success} <br> Status: ${status_message}`)
  }
});

// ============================== Media Pages ==================================================

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
});

// GET - Movie Review Page
app.get('/movie/:id/reviews/:userId', async (req,res)=>{
  const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}`, options);
  const details = detailsResponse.data;
  const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/reviews`, options)
  const reviews = reviewsResponse.data.results;

  User.findOne({ _id: req.params.userId })
  .then((user)=>{
    res.status(200).render('movie/reviews', {reviews, details, user})
  })  
});


// POST - Submit a review for a movie
app.post('/movie/:id/reviews/:userId', async (req, res) => {
  try {
    const newReview = new Review({
      movieId: req.params.id,
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

      console.log(newComment)
      res.status(200).redirect(`/movie/${req.params.id}/reviews/${req.params.userId}`);
  } catch (error) {
    console.error('Error submitting review', error);
    res.status(500).send('Server Error');
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


  // User.find({}, {name:1, _id:0})
  // .then((name)=>{
  //   console.log(name)
  // })
  // .catch((error)=>{
  //   console.log("error finding users, error")
  // })


  // mongoose.connect('mongodb://localhost/blockBusterAuthentication', {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false,
  // });


  // User.findOneAndUpdate(
  //   { name: "Richard Schleckser" },
  //   { $push: { reviews: [{  movieId: '1726',
  //     userId: mongoose.Types.ObjectId('6657fc5732511c6bc0dbd106'),
  //     author: 'Richard Schleckser',
  //     content: 'The Movie was Great!!!!!!!',
  //     createdAt: Date.now()}] } },
  //   { new: true }
  // )
  // .then((updatedUser) => {
  //   console.log("Updated user:", updatedUser);
  // })

  // User.find({name: "Richard Schleckser"})
  // .then((name)=>{
  //   console.log(name[0])
  // })



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
