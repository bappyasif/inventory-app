var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let catalogRouter = require("./routes/app_route")

var app = express();

let mongoDB = `mongodb+srv://ab:1234@invapp-cluster.a2o7tu7.mongodb.net/invapp_data?retryWrites=true&w=majority`
mongoose.connect(mongoDB, {useNewUrlParser: true , useUnifiedTopology: true})
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter);

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
