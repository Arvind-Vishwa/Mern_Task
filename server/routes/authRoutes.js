const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authcontroller');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/* Google */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login`, session: true }),
  (req, res) => {
    res.redirect(CLIENT_URL);
  });

/* Facebook */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${CLIENT_URL}/login`, session: true }),
  (req, res) => {
    res.redirect(CLIENT_URL);
  });

/* GitHub */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/login`, session: true }),
  (req, res) => {
    res.redirect(CLIENT_URL);
  });

// Return current user
router.get('/user', authController.getUser);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
