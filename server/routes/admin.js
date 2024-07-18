const express = require('express');
const { User } = require('../database');

const router = express.Router();

router.post('/kickout', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  user.isLocked = true;
  await user.save();
  res.json({ message: 'User kicked out successfully.' });
});

module.exports = router;
