const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize / deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/**
 * Helper to findOrCreate user
 */
async function findOrCreateUser({ provider, providerId, email, name, avatar }) {
  let user = await User.findOne({ provider, providerId });
  if (!user) {
    // try to match by email
    if (email) {
      user = await User.findOne({ email });
    }
  }
  if (user) {
    // update provider info if missing
    user.provider = provider;
    user.providerId = providerId;
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    await user.save();
    return user;
  }
  const newUser = await User.create({ provider, providerId, email, name, avatar });
  return newUser;
}

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const user = await findOrCreateUser({
        provider: 'google',
        providerId: profile.id,
        email,
        name: profile.displayName,
        avatar: profile.photos && profile.photos[0] && profile.photos[0].value
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}

// Facebook Strategy
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const user = await findOrCreateUser({
        provider: 'facebook',
        providerId: profile.id,
        email,
        name: profile.displayName,
        avatar: profile.photos && profile.photos[0] && profile.photos[0].value
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub sometimes doesn't return primary email in profile.emails
      let email = null;
      if (profile.emails && profile.emails.length) {
        email = profile.emails.find(e => e.primary)?.value || profile.emails[0].value;
      }
      const user = await findOrCreateUser({
        provider: 'github',
        providerId: profile.id,
        email,
        name: profile.displayName || profile.username,
        avatar: profile.photos && profile.photos[0] && profile.photos[0].value
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}
