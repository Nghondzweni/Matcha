
var userFunctions = require('../public/javascripts/user_functions');
var userFunc = require("../public/javascripts/userFunctions")
const db_connect = require('../app');

module.exports.register = function(req, res){
  res.render("register", 
  {
    title: "Registration",
    success: req.session.success,
    errors: req.session.errors,
    duplicate_errors: req.session.error_msg,
    css: "register"  
  });
  req.session.error_msg  = null;
  req.session.errors = null;
  req.session.success = null;
  req.flash('error_msg', "");
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
    res.redirect('/register');
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
  userFunc.registerFunction(req, res,params);
  }
}

module.exports.login = function(req, res){
  res.render("login", 
  {
    title: "Login",
    success: req.session.success,
    errors: req.session.errors
  })
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
    res.redirect('/register');
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

module.exports.home = function(req,res){
  res.render("home", 
  {
    title: "Home",
    success: req.session.success,
    errors: req.session.errors,
    user_id: req.session.user_id,
    username : req.session.username,
    email : req.session.email,
    first_name : req.session.first_name,
    last_name : req.session.last_name
  });
}

module.exports.verificationFunction = function(req, res) {  
  if(req.params.username != null)
  {
    userFunc.accountVerification(req, res, req.params.username, req.params.key);
  }
  else{
    console.log("bad parameter");
    req.flash('error_msg', "Verification failed, please contact Tsundzukani");
    res.redirect("/register");
  }
}