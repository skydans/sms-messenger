const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');  // for database

// require routes
const indexRouter = require('./routes/index');
const messageRouter = require('./routes/messages');
const apiRouter = require('./routes/raw');
const app = express();

// database connect
mongoose.connect(process.env.DB_URI, (err) => {
  if (err) {
    console.log("Error with mongoose.connect in app.js   (probably didn't set the environment variable: DB_URI)");
    console.log(err);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use routes
app.use('/', indexRouter);
app.use('/messages', messageRouter);
app.use('/raw', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
