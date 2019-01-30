
var userFunctions = require('../public/javascripts/user_functions');
const db_connect = require('../app');

module.exports.register = function(req, res){
  res.render("register", 
  {
    title: "Registration",
    success: req.session.success,
    errors: req.session.errors,
    duplicate_errors: req.session.error_msg 
  });
  req.session.error_msg  = null;
  req.session.errors = null;
  req.session.success = null;
}

module.exports.registerValidation = function(req, res){
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('first_name', 'First name is required').notEmpty();
  req.checkBody('last_name', 'Last name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password Confirmation is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('gender', 'Gender is required').notEmpty();

  
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/users/register');
  } 
  else 
  {
    var params = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender
  };
  userFunctions.registerFunction(req, res,params);
  }
}

module.exports.login = function(req, res){
  res.render("login", 
  {
    title: "Login",
    success: req.session.success,
    errors: req.session.errors,
    username : req.session.username
  });
  req.session.success = null;
  req.session.errors = null;
  req.session.username = null;
}

module.exports.loginValidation = function(req, res){
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  var params = {
    email: req.body.email,
    password: req.body.password
  };
 
  var errors = req.validationErrors();
  if (errors) 
  {
    req.session.errors = errors;
    req.session.success = null;
    res.redirect('/users/register');
  }
  else
  {
    userFunctions.loginFunction(req, res, params);
  }
}

module.exports.logout = function (req, res)
{
  userFunctions.logoutFunction(req, res);
}