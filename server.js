const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
require('dotenv').config();

//Middleware
app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(
  '/semantic',
  express.static(__dirname + 'node_modules/semantic-ui-css')
);

//GET - Home Page
app.get('/', async (req, res) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };

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
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.API_READ_ACCESS_TOKEN,
    },
  };

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

    res.status(200).render('home/show', { response: response.data.results });
  } catch (error) {
    console.error('Error fetching movie', error);
    res.status(500).send('Error fetching movie');
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
