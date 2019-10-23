const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  // A user can be anonymous, so author is not required. Just a name (e.g, 'Anonymous')
  author: {
    id: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: false
    }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: String,
    default: Date.now()
  },
  likes: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Posts', PostSchema, 'Posts');