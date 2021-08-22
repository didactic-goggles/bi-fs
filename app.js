const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/posts');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const globalErrorHandler = require('./controllers/errorController');

app.use('/api/posts', postsRouter);
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './public', 'index.html'));
});

app.use(globalErrorHandler);
module.exports = app;
