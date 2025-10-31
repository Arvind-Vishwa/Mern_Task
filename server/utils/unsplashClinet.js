const axios = require('axios');

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!UNSPLASH_KEY) {
  console.warn('Warning: UNSPLASH_ACCESS_KEY not set. Unsplash calls will fail.');
}

const BASE = 'https://api.unsplash.com';

async function searchPhotos(term, page = 1, per_page = 20) {
  if (!UNSPLASH_KEY) throw new Error('UNSPLASH_ACCESS_KEY not configured');

  const url = `${BASE}/search/photos`;
  const params = {
    query: term,
    page,
    per_page
  };

  const headers = {
    Authorization: `Client-ID ${UNSPLASH_KEY}`
  };

  const res = await axios.get(url, { params, headers });
  // normalize to only needed fields
  const data = res.data;
  return {
    total: data.total,
    results: data.results.map(r => ({
      id: r.id,
      alt_description: r.alt_description,
      urls: r.urls,
      user: {
        name: r.user && r.user.name,
        username: r.user && r.user.username
      }
    }))
  };
}

module.exports = { searchPhotos };
