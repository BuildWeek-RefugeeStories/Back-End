const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: false,
    default: "",
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  likedPosts: [String],
  posts: [String]
});

module.exports = mongoose.model('Users', UserSchema, 'Users');