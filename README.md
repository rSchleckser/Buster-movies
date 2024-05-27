# Buster Movie Website

## Table of Contents

- [Introduction](#introduction)
- [User Story](#user-story)
- [Wireframe](#wireframe)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [ERD](#erd)

## Introduction

Buster Movie Website is a platform where users can discover the latest movies and TV shows. Users can sign up, log in, view their profile, and browse through a list of movies and TV shows. The site uses data from The Movie Database (TMDB) API to fetch information about movies and TV shows.

## User Story

Users can:

- Create an account to view and interact with website
- Log into account after creatation
- Access User Dashboard, this will allow the user to browse movies/tv shows and view personal profile
- Viewers can click on movies or tv show to access more information on the movie /tv show
- Specific movie / tv show displayed will have watchlist and favorites buttons which will be added to users list and can be viewed at a later time
- User can create, edit, or delete reviews specific to ones that they have made

## Wireframe

![WireFrame](/public/img/coral_wireframe.png)

## Features

- **Home Page**: Welcome message and featured movies.
- **Signup Page**: Allows new users to create an account.
- **Login Page**: Allows existing users to log in.
- **Profile Page**: Users can view and edit their profile information.
- **Movies Page**: Lists all movies with details like title, release date, overview, rating, and popularity.
- **TV Shows Page**: Lists all TV shows with details like title, first air date, overview, rating, and popularity.

## Technologies Used

- **Frontend**: HTML, CSS, Semantic UI, EJS
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **API**: The Movie Database (TMDB) API

## ERD

- **User**:
  <br>id, username, email, password

- **Movie**:
  <br>id, title, release date, overview, poster, vote_average, popularity

- **TV Show**:
  <br>id, title, first air date, overview,poster, vote_average, popularity
- **Review**:
  <br>id, userid, subject, message, vote

![ERD](/public/img/coral_erd.png)
