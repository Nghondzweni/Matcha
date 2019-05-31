var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var mysql = require('mysql');
var SqlString = require('sqlstring');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var setup = require('./controllers/admin');
const config = require('./config/database');
const session = require('express-session');
const MongoSotre = require('connect-mongo')(session);
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


var app = express();


mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true});
var db = mongoose.connection;
db.once('open', function() {
	console.log('Connected to MongoDB');
});
db.on('error', function(err) {
	console.log(err);
});

  app.use(expressValidator());
  app.use(bodyParser.urlencoded({extended : true}));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

 

  app.use(session({
    secret: "Tsundzukani",
    resave: false,
    saveUninitialized: false,
    store: new MongoSotre({ mongooseConnection: mongoose.connection})
    // cookie: {maxAge: 180 * 60 * 1000}
  }));

   //Passport init
   app.use(passport.initialize());
   app.use(passport.session());

  //Connect Flash
  app.use(flash());

  //Global Variables for Flash Messages
  app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  })
  

  app.use(bodyParser.json());

  // view engine setup
  app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts'
  }));
  app.set('views', path.join(__dirname, 'views/layouts'));
  app.set('view engine', 'hbs');


  var usersController = require('./controllers/usersController');
  var profileController = require('./controllers/profileController');
  var adminController = require('./controllers/admin');
  // var userSettingsController = require('./controllers/userSettings');
  
  
  /* ===============================
  -   GETS
  ================================*/
  
  app.get("/register", usersController.register);
  app.get("/login", usersController.login);
  app.get("/setup", authenticationMiddleware(), adminController.setup);
  // app.get("/settings", authenticationMiddleware(), userSettingsController.modifyInfo);
  app.get("/home", authenticationMiddleware(), usersController.home);
  app.get("/",
          (req, res, next) => {if (req.isAuthenticated()) return next();
          res.redirect('/register')}, usersController.home);
  app.get("/logout", authenticationMiddleware(), usersController.logout);
  app.get("/verification/:username/:key", usersController.verificationFunction);
  app.get("/profile", authenticationMiddleware(), profileController.profile);
  app.get("/user/:id", authenticationMiddleware(), usersController.user);
  
  
  /* ===============================
  -   POSTS
  ================================*/
  
  app.post("/registerValidation", usersController.registerValidation);
  app.post("/loginValidation", usersController.loginValidation);
  // app.post("/settings/executeModifyInfo", userSettingsController.executeModifyInfo);


function authenticationMiddleware()
{
	return (req, res, next) => {
	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}

  
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404)); 
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = app;
 