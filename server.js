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
const methodOverride = require('method-override');


// import controllers
const {getHomePage} = require('./controllers/home')
const {getDashboard} = require('./controllers/dashboard')
const {getProfile, getWatchlist, getFavorites} = require('./controllers/profile')
const {getSearchResults, postToSearchList, updateSearchList } = require('./controllers/search')
const {getAllMovies, postMoviesToList, updateMoviesList, getMovieShowPage, getMovieReviewPage, postMovieReview, updateMovieReview, deleteMovieReview } = require('./controllers/movies')
const {getAllTvShows,postTvShowsList, updateTvShowsList, getTvShowPage, getTvShowsReviewPage, postTvShowReview, updateTvShowReview, deleteTvShowReview} = require('./controllers/tv')
const {getPersonShowPage} = require('./controllers/person')


//Middleware
app.use(methodOverride('_method'));
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


// ==================================================================================
//GET - Home Page
app.get('/', getHomePage);

// ==================================================================================
//import auth routes
app.use('/auth', require('./controllers/auth'));

//GET - Dashboard
app.get('/dashboard/:id', isLoggedIn, getDashboard)

// =============================== User Pages ====================================

//Go to user profile page
app.get('/profile/:userId', isLoggedIn, getProfile);

//GET - Go to user watchlist page
app.get('/profile/:userId/watchlist', isLoggedIn, getWatchlist);

// Get - Go to user favorite page
app.get('/profile/:userID/favorites', isLoggedIn, getFavorites)

// ================================== Search Pages ===================================

 
//Search Results Page
app.get('/search/:userId/results', isLoggedIn, getSearchResults);

//POST - add to watchlist/favorites
app.post('/search/:userId/results', isLoggedIn, postToSearchList);

// PUT - Remove Movie from watchlist/favorites
app.put('/search/:userId/results', isLoggedIn, updateSearchList);


// ============================== Movies ==================================================

// GET - ALL MOVIES
app.get('/movies/:userId', isLoggedIn, getAllMovies)

//POST - add Movie to watchlist/favorites
app.post('/movies/:userId', isLoggedIn, postMoviesToList);

// PUT - Remove Movie from watchlist/favorites
app.put('/movies/:userId', isLoggedIn, updateMoviesList);

// GET - Movie Show Page
app.get('/movie/:id/:userId', isLoggedIn, getMovieShowPage);

// GET - Movie Review Page
app.get('/movie/:id/reviews/:userId', isLoggedIn, getMovieReviewPage);

// POST - Submit a review for a movie
app.post('/movie/:id/reviews/:userId', isLoggedIn, postMovieReview)

// PUT - Update a review for a movie
app.put('/movie/:id/reviews/:reviewId', updateMovieReview);

// DELETE - Delete a review for a movie
app.delete('/movie/:id/reviews/:userId', isLoggedIn, deleteMovieReview);

// =========================================== TV SHOWS ==============================================

// GET - ALL TV SHOWS
app.get('/tvShows/:userId', isLoggedIn, getAllTvShows)

//POST - add Movie to watchlist/favorites
app.post('/tvShows/:userId', isLoggedIn, postTvShowsList);

// PUT - Remove Movie from watchlist/favorites
app.put('/tvShows/:userId', isLoggedIn, updateTvShowsList);

// GET - TV Show Page
app.get('/tv/:id/:userId', isLoggedIn, getTvShowPage)

  // GET - TV Show Review Page
app.get('/tv/:id/reviews/:userId',isLoggedIn, getTvShowsReviewPage);

// POST - Submit a review for a TV Show
app.post('/tv/:id/reviews/:userId', isLoggedIn, postTvShowReview)

// PUT - Update a review for a TV Show
app.put('/tv/:id/reviews/:reviewId', isLoggedIn, updateTvShowReview);

// DELETE - Delete a review for a movie
app.delete('/tv/:id/reviews/:userId', isLoggedIn, deleteTvShowReview);

  
// ============================================ Person =========================================================

  // GET - Person Show Page
  app.get('/person/:id/:userId', isLoggedIn, getPersonShowPage)

// 404 Middleware
  app.use((req, res, next) => {
    res.status(404).render('404');
  });

// 500 Middleware
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render('404')
  })

// Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
