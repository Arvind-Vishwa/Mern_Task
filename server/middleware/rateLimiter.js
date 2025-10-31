const rateLimit = require('express-rate-limit');

// Example: 30 requests per 60 seconds per IP
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: 'Too many requests, please try again later.' }
});

module.exports = { searchLimiter };
