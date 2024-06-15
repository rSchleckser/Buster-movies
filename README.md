# Buster Movie Website

## Table of Contents

- [Introduction](#introduction)
- [User Story](#user-story)
- [Wireframe](#wireframe)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [ERD](#erd)
- [Installation](#installation)

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

## Installation

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/download/) (which includes npm)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

### Steps

1. **Clone the repository**

   Open your terminal and run:
   ```sh
   git clone https://github.com/yourusername/buster-movie-website.git

2. **Navigate to the project directory**
   
   ```sh
   cd Buster-movies

3. **Install dependencies**

   Run the following command to install the necessary packages:
  
   ```sh
   npm install

4. **Creating a TMDB API Account**

   - **Sign Up for TMDB Account:**
     - Go to the [TMDB website](https://www.themoviedb.org/).
     - Click on "Join TMDB" at the top right corner.
     - Fill in the required information to create your account.
     - Verify your email address by clicking the link sent to your email.

   - **Generate API Key:**
     - Log in to your TMDB account.
     - Click on your profile icon in the top right corner and select "Settings".
     - In the left-hand menu, click on "API".
     - Click on the "Create" button to generate a new API key.
     - Fill in the necessary details about your application and agree to the terms of use.
     - Your API key will be generated and displayed. Make sure to copy and save it for later use.

   
5. **Set up environment variables**

   Create a .env file in the root directory of the project and add the following environment variables:

   ```sh
   TMDB_API_KEY=your_tmdb_api_key
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret

6. **Start MongoDB**

   Make sure your MongoDB server is running. You can start it with the following command if you're running MongoDB locally:

   ```sh
   mongod

7. **Run the application**

   Start the application using the following command:

   ```sh
   npm start

