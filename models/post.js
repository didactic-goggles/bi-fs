const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post must have a name'],
  },
  content: {
    type: String,
    required: [true, 'Post must have a content'],
  },
  image: {
    type: String,
    required: [true, 'Post must have an image'],
  },
  categories: [
    {
      type: String,
      enum: ['Quote', 'Fashion', 'Food', 'Gaming', 'Video'],
    },
  ],
});

PostSchema.pre('save', function (next) {
  this.categories = this.categories.filter((c, i, a) => a.indexOf(c) === i);
  next();
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
