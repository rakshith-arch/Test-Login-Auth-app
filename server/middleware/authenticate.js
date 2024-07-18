const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../database');

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({ username: decoded.username });
    if (!user || user.isLocked) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (ex) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;
