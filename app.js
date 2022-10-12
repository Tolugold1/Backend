var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var session = require('express-session');
var FileStorage = require("session-file-store")(session);
var passport = require("passport");
var authenticate = require("./authenticate");
const config = require("./config")


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require("./routes/dishRouter")
const leaderRouter = require("./routes/leaderRouter");
const promotionRouter = require("./routes/promotionRouter");

var app = express();

const url = config.mongoUrl;

mongoose.connect(url)
.then((db) => {
  console.log("Connected to MongoDB successfully!");
}, (err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* app.use(cookieParser("01234-56789-98765-43210")); */
/* app.use(session({
  name: 'session_id',
  secret: "01234-56789-98765-43210",
  saveUninitialized: false,
  resave: false,
  store: new FileStorage(),
})) */

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* const auth = (req, res, next) => {
  console.log(req.user);

  if (!req.user) {
    var err = new Error("You are not authorized to access this website.");
    err.status = 401;
    return next(err);;
  } else {
      next();
  }
}

app.use(auth);
 */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/leader', leaderRouter);
app.use('/promotion', promotionRouter);

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
