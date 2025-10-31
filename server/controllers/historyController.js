const Search = require('../models/Search');

exports.getHistory = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const history = await Search.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(history.map(h => ({
      term: h.term,
      resultCount: h.resultCount,
      createdAt: h.createdAt
    })));
  } catch (err) {
    next(err);
  }
};

exports.getTopSearches = async (req, res, next) => {
  try {
    const top = await Search.aggregate([
      { $group: { _id: '$term', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, term: '$_id', count: 1 } }
    ]);
    res.json(top);
  } catch (err) {
    next(err);
  }
};
