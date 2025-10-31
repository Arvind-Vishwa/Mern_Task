const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  term: { type: String, index: true },
  resultCount: Number,
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Search', SearchSchema);
