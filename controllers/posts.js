const Post = require('../models/post');
const catchAsync = require('../utils/catchAsync');
exports.getPosts = async (req, res, next) => {
const posts = await Post.find();
  res.status(200).json({
    status: 'success',
    data: posts,
  });
};

exports.createPost = catchAsync(async (req, res, next) => {
  const postData = req.body;
  const post = await Post.create(postData);

  res.status(201).json({
    status: 'success',
    data: post,
  });
});
