const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('./database');

mongoose.connect('mongodb://localhost:27017/auth-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');
  
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password123', saltRounds);
  await User.create({ username: 'testuser1@example.com', password: passwordHash });
  
  console.log('User seeded');
  mongoose.connection.close();
}).catch(err => console.error('MongoDB connection error:', err));
