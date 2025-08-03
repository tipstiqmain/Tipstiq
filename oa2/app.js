/**
 * @file app.js
 * @description Express.js application for handling OAuth2 authentication with Google.
 * This file sets up an Express server that acts as an authentication service.
 * It uses Passport.js with the Google OAuth2 strategy to handle the login flow.
 * After successful authentication, it generates a JSON Web Token (JWT) and
 * redirects the user back to the main application with the token.
 * It also includes a proxy for API calls to the main crypto-app.
 */

// Import necessary modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Load environment variables from the .env file
require('dotenv').config();

// Create the Express application
const app = express();

// Use express-session middleware to manage sessions
app.use(session({
  // A secret key to sign the session ID cookie. Should be in an env var.
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization/deserialization for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id: id });
});

// Configure the Google OAuth 2.0 strategy for Passport.js
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.OAUTH_REDIRECT_URI,
},
(accessToken, refreshToken, profile, done) => {
  console.log('Google profile retrieved:', profile);
  return done(null, profile);
}
));

// Define the route to initiate the Google OAuth flow
app.get('/auth/google',
        passport.authenticate('google', {
          scope: ['profile', 'email']
        })
);

// Define the callback route that Google will redirect to after authentication
app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
          const tokenPayload = {
            id: req.user.id,
            displayName: req.user.displayName,
            email: req.user.emails[0].value
          };

          const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
          const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '1h' });

          // CRITICAL FIX: Redirect to the crypto-app's host port (3001) with the token.
          res.redirect(`http://localhost:3001/?token=${token}`);
        }
);

// The proxy to forward all other requests to the crypto-app container.
// This is crucial for the docker-compose setup to work.
const cryptoAppProxy = createProxyMiddleware({
  target: 'http://crypto-container:3000', // Pointing to the crypto-app container's name and internal port.
  changeOrigin: true
});

app.use('/', cryptoAppProxy);

// Start the Express server on port 2000
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`OAuth server running on port ${PORT}`);
});
