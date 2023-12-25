const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const AppError = require('./src/services/appError');
const errorHandler = require('./src/services/error');

const app = express();

// middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_SESSION_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// time of requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

// basedir
global.__basedir = __dirname + '\\';

app.use(express.static(__dirname + '/src/assets'));

// routes
require('./src/resources/global/router')(app);
require('./src/resources/module/supplyChain/router')(app);
require('./src/resources/module/ecommerce/router')(app);

app.all('*', (req, res, next) => {
  next(new AppError(`We Can't Find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
