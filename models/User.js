const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmpassword: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  loginTimes: {
    type: [Date],
    default: []
  },
  logoutTimes: {
    type: [Date],
    default: []
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
