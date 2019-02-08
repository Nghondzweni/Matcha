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
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var setup = require('./controllers/admin')
// var transporter = require('nodemailer'); 
// var nocache = require('nocache')

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var adminRouter = require('./routes/admin');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var adminRouter = require('./routes/admin');

var app = express();




var usersController = require('./controllers/users');
var adminController = require('./controllers/admin');
var userSettingsController = require('./controllers/userSettings');


//Setup database connection
module.exports.adminDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
});


//create sql connection
module.exports.db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'matcha'
});

// setup.setup();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'matcha'
});

module.exports.sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  connectionLimit: 1,
  endConnectionOnClose: true,
  charset: 'utf8mb4_bin',
  schema: {
      tableName: 'sessions',
      columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
      }
  }}/* session store options */, connection);


// connect
// db.connect(function (err) {
  //   if (err) {
    //     console.error('error connecting: ' + err.stack);
    //     return;
    //   }
    //   console.log('connected as id ' + db.threadId);
    // });
    
    
    // app.use(nocache())
    app.use(expressSession({secret: 'max', store: module.exports.sessionStore = new MySQLStore({
      clearExpired: true,
      checkExpirationInterval: 900000,
      expiration: 86400000,
      createDatabaseTable: true,
      connectionLimit: 1,
      endConnectionOnClose: true,
      charset: 'utf8mb4_bin',
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }}/* session store options */, connection)
      , saveUninitialized: false, resave: false}));

      app.use(expressValidator());
      app.use(bodyParser.urlencoded({extended : true}));
      app.use(logger('dev'));
      app.use(express.json());
      app.use(express.urlencoded({
        extended: false
        
      }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));
      
      
      /* ===============================
      -   GETS
      ================================*/
      
      app.get("/register", usersController.register);
      app.get("/login", usersController.login);
      app.get("/setup", adminController.setup);
      app.get("/settings",userSettingsController.modifyInfo);
      app.get("/home", usersController.home);
      app.get("/logout", usersController.logout);
      app.get("/verification/:type/:key", usersController.verificationFunction)
      
      
      /* ===============================
      -   POSTS
      ================================*/
      
      app.post("/registerValidation", usersController.registerValidation);
      app.post("/loginValidation", usersController.loginValidation);
      app.post("/settings/executeModifyInfo", userSettingsController.executeModifyInfo);
  
  
      // view engine setup
      app.engine('hbs', hbs({
        extname: 'hbs',
        defaultLayout: 'layout',
        layoutsDir: __dirname + '/views/layouts'
      }));
      app.set('views', path.join(__dirname, 'views/layouts'));
      app.set('view engine', 'hbs');
      
      
      // app.use('/', indexRouter); //mount index route at / path
      // app.use('/users', usersRouter);
      // app.use('/admin', adminRouter);
      
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