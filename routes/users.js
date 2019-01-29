var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var exist_errors = 0;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('register', {
    title: 'Registration',
    success: req.session.success,
    errors: req.session.errors,
    // error_msg: req.session.error_msg
  });
  req.session.errors = null;
});

router.get('/register', function (req, res) {
  res.render('register', {
    title: 'Registration',
    success: req.session.success,
    errors: req.session.errors
  });
  req.session.errors = null;
});

router.get('/login', function (req, res) {
  res.render('login', {
    title: 'Login',
    success: req.session.success,
    errors: req.session.errors
  });
  req.session.errors = null;
});
 
/* Insert record into database */ 
function register(email, username, password, first_name, last_name, gender, exist_errors){
  var connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'matcha'
  });

  var check = "SELECT * FROM `users` WHERE email = '" + email +"' OR username = '" + username + "'"
  connect.query(check, function(error, results) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    if(results)
    {
      if(results[0].email === email)
      {
        // req.session.error_msg = "email already exists";
        exist_errors = 1;
      }
      if(results[0].username ===  username)
      {
        // req.session.error_msg = "username already exists";
        exist_errors = 2;
      }
      // if(results[0].email === email && results[0].username === username)
      // {
      //   exist_errors = 3;
      // }      
    }
    else
      console.log('User does not exist in database. Ready to register');
  });

  return;

  var insert = "INSERT INTO `users` (email, username, password, first_name, last_name, gender)\
  VALUES ('" + email +"', '" + username +"', '" + password +"', '" + first_name +"', '" + last_name +"', '" + gender +"')";

  connect.query(insert, function (error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    console.log('User successfully registered');
  })
};

/* User Registration Validation */
router.post('/register_validation', (req, res) => {  
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var gender = req.body.gender;
  
  //validation
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('first_name', 'First name is required').notEmpty();
  req.checkBody('last_name', 'Last name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password Confirmation is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(password);
  req.checkBody('gender', 'Gender is required').notEmpty();

  
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/users/register');
  } else {
    console.log("here111");

    register(email, username, password, first_name, last_name, gender, exist_errors)
    
    console.log("here2222");
    
    // var error_msg = "email already exists";
    
    // if(exist_errors)
    // {
    //   // console.log("here2 inside");
    //   // if(exist_errors === 1)
    //   // {
    //   //   req.session.error_msg = "email already exists";
    //   //   var error_msg = "email already exists";
    //   // }
    //   // if(exist_errors === 2)
    //   // {
    //   //   req.session.error_msg = "username already exists";
    //   //   var error_msg = "username already exists";
    //   // }
    //   // if(exist_errors === 3)
    //   // {
    //   //   var error_msg = "The Email address and Username entered already exist";
    //   // }
    //   res.redirect('/users/register');
    // }
      console.log("here outside");

      res.redirect('/users/register');  
    return;
    req.session.success = true;
    // res.redirect('/users/login');
  }
  res.end();
});


/* User Login Validation */
router.post('/login_validation', (req, res) => {

  var email = req.body.email;
  var password = req.body.password;

  //validation
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
  } else {
    req.session.success = true;
  }
  res.redirect('/users/login');
});

module.exports = router;