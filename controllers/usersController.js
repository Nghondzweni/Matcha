
var userFunctions = require('../public/js/user_functions');
var userFunc = require("../public/js/functions/usersFunctions");
var User = require("../models/users");


module.exports.register = function(req, res){
  var currentTime =  new Date();
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var years = range((currentTime.getFullYear() - 167), (currentTime.getFullYear() - 18)).reverse();
	var days  = range(1, 31);
  res.render("register", 
  {
    title: "Registration",
    success: req.session.success,
    errors: req.session.errors,
    duplicate_errors: req.session.error_msg,
    css: ["home"],  
    layout: 'index',
    js : ["slider "],
    months: months,
		years: years,
		days: days
  });
  req.session.error_msg  = null;
  req.session.errors = null;
  req.session.success = null;
  req.flash('error_msg', "");

  function range(start, end)
	{
		var numbers = [];

		for (var i = start; i <= end; i++)
		{
			numbers.push(i);
		}
		return numbers;
	}
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
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    gender: req.body.gender
  };
  userFunc.registerFunction(req, res,params);
  }
}

module.exports.login = function(req, res){
  if(req.isAuthenticated()){
    res.redirect("/home");
  }
  else{
    res.render("login", 
    {
      title: "Login",
      css: ["home", "login"],
      js: ["slider"],
      layout: 'index'
    })
    req.session.errors = null;
    req.session.success = null;
    req.flash('error_msg', "");
  }
  
}
    
module.exports.loginValidation = function(req, res){
  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  var params = {
    username: req.body.username,
    password: req.body.password
  };
 
  var errors = req.validationErrors();
  if (errors) 
  {
    req.session.errors = errors;
    req.session.success = null;
    res.redirect('/login');
  }
  else
  {
    userFunc.loginFunction(req, res, params);
  }
}

module.exports.logout = function (req, res)
{
  userFunctions.logoutFunction(req, res);
}

module.exports.home = function(req,res){
  
  content =  {
    title: "Home",
    css: ["chat"],
    js: ["search"],
    isHome : true
  }

  User.find({}, function(err, users){
		if (err) throw err;

    content.users = users;
    content.isAuthenticated = req.isAuthenticated();
		res.render("home", content);
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




module.exports.user = function(req, res){
  var content = {
		title: "Matcha | User Profile",
		css: ["profile","user"],
		js: ["slider"]
  };
  
  var id = req.params.id;

	User.findOne({_id: id}, function(err, user){
		if (err) throw err;
		var orStatement = [{userId1: id, userId2: req.user._id}, {userId2: id, userId1: req.user._id, match: 1}];

		// Likes.findOne({$or: orStatement}, function(err, likes){
		// 	if (err) throw err;

			content.user = user;
		// 	if (likes && ((likes.userId1.toString() == req.user._id.toString()) || (likes.userId2.toString() == req.user._id.toString())))
				// content.like = "fas fa-star";
		// 	else
				content.like = "far fa-star";

			res.render('user', content);
		// });

	});
}