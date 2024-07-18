const mongoose = require('mongoose');
const bcrypt = require('bcrypt');




const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  failedAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false }
});

const otpLinkSchema = new mongoose.Schema({
  username: String,
  otpLink: String,
  expiresAt: Date
});

userSchema.methods.validPassword=async function(password){
   
  try {
      return await bcrypt.compare(password,this.password);
      
  } catch (error) {
      throw(error);
  }

}

const User = mongoose.model('User', userSchema);
const OtpLink = mongoose.model('OtpLink', otpLinkSchema);

module.exports = { User, OtpLink };
