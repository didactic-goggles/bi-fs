const multer = require('multer');
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: async function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      const filename = `post-${Date.now()}-${file.originalname}`;
      const filenameSmall = `rs-post-${Date.now()}-${file.originalname}`;
      cb(null, filename);
      await sharp(req.file.buffer)
        .resize(450, 300)
        .toFile(`public/uploads/${filenameSmall}`);
      req.body.image = filename;
    } else {
      cb(new AppError('Please upload image or document.', 400), false);
    }
  },
});

const upload = multer({ storage: storage });

exports.uploadPostImage = upload.single('image');
