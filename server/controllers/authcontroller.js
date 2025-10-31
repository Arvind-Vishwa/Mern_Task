// minimal helpers for auth routes
exports.getUser = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // return user sanitized
    const { _id, name, email, avatar, provider } = req.user;
    return res.json({ user: { _id, name, email, avatar, provider } });
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid', { path: '/' });
      return res.json({ message: 'Logged out' });
    });
  });
};
