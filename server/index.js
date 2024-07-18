const express = require('express');
const bodyParser = require('body-parser');


const authenticate = require('./middleware/authenticate');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth-app').then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/time', authenticate, (req, res) => {
  res.json({ time: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log(`Server is running`);
});
