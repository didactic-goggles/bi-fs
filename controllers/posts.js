const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/post');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    status: 'success',
    data: posts,
  });
};

exports.createPost = catchAsync(async (req, res, next) => {
  const postData = req.body;
  req.body.created = new Date().toISOString();
  const post = await Post.create(postData);

  res.status(201).json({
    status: 'success',
    data: post,
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resizePostImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  try {
    const { file } = req;
    if (file.size > 1000000)
      return next(new AppError('Please upload an image less than 1mb'));
    const filename = `post-${Date.now()}-${file.originalname}`;
    const filenameSmall = `rs-post-${Date.now()}-${file.originalname}`;
    await sharp(req.file.buffer)
      .resize(900, 600)
      .toFile(`public/uploads/${filename}`);
    await sharp(req.file.buffer)
      .resize(450, 300)
      .toFile(`public/uploads/${filenameSmall}`);
    req.body.image = filename;
    return next();
  } catch (err) {
    return next(new AppError(err))
  }
});

exports.uploadPostImage = upload.single('image');
