const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, OtpLink } = require('../database');
const config = require('../config');
const crypto = require('crypto');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
  if (user.isLocked) {
    return res.status(403).json({ message: 'Account is locked due to multiple failed attempts.' });
  }
  const validPassword = await user.validPassword(password);
  console.log(validPassword);
  // if (!validPassword) {
  //   user.failedAttempts += 1;
  //   if (user.failedAttempts >= config.maxAttempts) {
  //     user.isLocked = true;
  //   }
  //   await user.save();
  //   return res.status(401).json({ message: 'Invalid username or password.' });
  // }
  user.failedAttempts = 0;
  await user.save();
  const token = jwt.sign({ username: user.username }, config.jwtSecret, { expiresIn: '1h' });
  res.json({ token });
});


router.post('/otplink', async (req, res) => {
  const { username } = req.body;
  const otpLink = crypto.randomBytes(16).toString('hex');
  console.log(otpLink);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await OtpLink.create({ username, otpLink, expiresAt });
  res.json({ link: `http://localhost:3000/api/auth/verify/${otpLink}` });
});

router.get('/verify/:otpLink', async (req, res) => {
  const { otpLink } = req.params;
  const link = await OtpLink.findOne({ otpLink });
  if (!link || Date.now() > link.expiresAt) {
    return res.status(401).json({ message: 'Invalid or expired link.' });
  }
  await OtpLink.deleteOne({ otpLink });
  const token = jwt.sign({ username: link.username }, config.jwtSecret, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
