var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var validator = require('express-validator')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var expressHandlebar = require('express-handlebars')

mongoose.Promise = require('bluebird');
var dbConfig = require('./config/db');

var index = require('./routes/index');
var users = require('./routes/users');
var productRoute = require('./routes/product');


var app = express();

mongoose.connect(dbConfig.url);
require('./config/passport');

// view engine setup
// view engine setup
app.engine('.hbs',expressHandlebar({defaultLayout:'layout',extname: 'hbs',layoutsDir: __dirname + '/views/layouts/',partialsDir: __dirname + '/views/partials/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection:mongoose.connection }),
    cookie:{maxAge: 180 * 60 * 1000}
}));
app.use(flash());
//using passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

app.use('/', index);
app.use('/user', users);
app.use('/product',productRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
