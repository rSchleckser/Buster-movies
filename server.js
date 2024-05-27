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
    console.error('Error fetching Movies', error);
    res.status(500).send('Error fetching Movies');
  }
});

//Search Page
app.get('/search', (req, res) => {
  res.render('home/search');
});

//Show Page
app.get('/search/result', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?query=${req.query.media}&language=en`,
      options
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch trending movies');
    }

    response.data.results.forEach((media) => {
      if (media.media_type === 'tv') {
        console.log({ TV_SHOW: media.name, media_type: media.media_type });
      } else if (media.media_type === 'movie') {
        console.log({ Movie: media.title, media_type: media.media_type });
      }
      console.log(media);
    });

    
    res
      .status(200)
      .render('home/show', { response: response.data.results, movie_genre: movie_genre.genres, tv_genre: tv_genre.genres});
  } catch (error) {
    console.error('Error fetching movie', error);
    res.status(500).send('Error fetching movie');
  }
});

// GET - Movie Show Page
app.get('/movies/:id', async (req, res) => {
  res.send('Movie Page');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
