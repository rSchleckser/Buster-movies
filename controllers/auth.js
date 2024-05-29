const express = require('express');
const router = express.Router();
const passport = require('../config/passport-config');

//import user model
const { User } = require('../models');

// ======== GET ROUTES ===============
// --- go to signup page ---
router.get('/signup', (req, res) => {
  res.render('auth/signup', {});
});

// --- go to login page ---
router.get('/login', (req, res) => {
  res.render('auth/login', {});
});

//Log user out of app
router.get('/logout', (req, res) => {
  req.logOut((error, next) => {
    if (error) {
      req.flash('error', 'Error logging out. Please try again.');
      return next(error);
    }
    req.flash('success', 'Logging out ... See you next time!');
    res.redirect('/');
  });
});

// ======== POST ROUTES ===============
// --- grab data from req.body + create user + redirect + error handling ---
// --- name, email, phone, password ---
router.post('/signup', async (req, res) => {
  // create the phone number error, then we can address a solution
  // search for the email in database (unique)
  try {
    const findUser = await User.findOne({ email: req.body.email });
    // if findUser is null, then we create user
    if (!findUser) {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      });

      // authenticate the user via passport
      passport.authenticate('local', {
        successRedirect: '/profile',
        successFlash: `Welcome ${newUser.name}! Account created.`,
      })(req, res);
    } else {
      req.flash('error', 'Email already exists. Try another email');
      res.redirect('/auth/signup');
    }
  } catch (error) {
    console.log('----- ERROR IN SIGNUP POST ----', error);
    if (error.errors.phone.name === 'ValidatorError') {
      req.flash('error', 'Phone number needs be for in format XXX-XXX-XXXX');
      res.redirect('/auth/signup');
    }
  }
});

//login user
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome Back to your account',
    failureFlash: 'Either email or password is incorrect. Please try again',
  }),
  (req, res) => {
    // res.send(req.body);
  }
);

module.exports = router;
