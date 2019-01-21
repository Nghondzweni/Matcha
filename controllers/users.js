// var mysql = require('mysql');
// var expressValidator = require('express-validator');
var regFunction = require('../public/javascripts/user_functions');
// var express = require('express');
// var ssn;

module.exports.register = function(req, res){
  res.render("register", 
  {
    title: "Register",
    success: req.session.success,
    errors: req.session.errors
  });
  req.session.errors = null;
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
  } else {
    var params = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender
  };
  regFunction.registerFunction(req, res,params);
  }
}