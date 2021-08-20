const express = require('express');
const postsController = require('../controllers/posts');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(postsController.getPosts)
  .post(postsController.uploadPostImage, postsController.createPost);

module.exports = router;
