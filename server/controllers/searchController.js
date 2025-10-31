const Search = require('../models/Search');
const { searchPhotos } = require('../utils/unsplashClient');

exports.search = async (req, res, next) => {
  try {
    const { term } = req.body;
    if (!term || typeof term !== 'string' || term.trim().length === 0) {
      return res.status(400).json({ message: 'term is required' });
    }
    const q = term.trim().slice(0, 200);

    // Call Unsplash
    const unsplashRes = await searchPhotos(q, 1, 30);

    // Save to DB (async)
    try {
      await Search.create({
        userId: req.user._id,
        term: q,
        resultCount: unsplashRes.total
      });
    } catch (dbErr) {
      console.error('Failed to save search to DB', dbErr);
      // do not block response to user
    }

    res.json({
      term: q,
      total: unsplashRes.total,
      results: unsplashRes.results
    });
  } catch (err) {
    // if Unsplash rate-limited or error
    if (err.response && err.response.status === 429) {
      return res.status(429).json({ message: 'Unsplash rate limit reached. Try again later.' });
    }
    next(err);
  }
};
