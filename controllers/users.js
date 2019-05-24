
var userFunctions = require('../public/js/user_functions');
var userFunc = require("../public/js/userFunctions");
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

module.exports.profile = function(req, res) {
  User.findOne({_id: req.user._id}, function(err, preferences){
    var isAuthenticated = req.isAuthenticated();
    if (req.user.images)
			var defaultProfileImg =  (req.user.gender == "male") ? "img/male.png" : "img/female.jpeg";
    content = {
      title : "Profile",
      css : ["profile"],
      js : ["profile"], 
      user : req.user,
      preferences:req.user.preferences,
      profileImg: defaultProfileImg,
      isAuthenticated : isAuthenticated
    };

    content.sex = {
			men: (req.user.preferences.gender == 1) ? "checked" : "",
			women: (req.user.preferences.gender == 2) ? "checked" : "",
			both: (req.user.preferences.gender == 3) ? "checked" : ""
    }
    
    var interests = req.user.preferences.interests;
    
		content.interests = {
			movies: (interests.indexOf("movies") >= 0) ? "checked" : "",
			art: (interests.indexOf("art") >= 0) ? "checked" : "",
			food: (interests.indexOf("food") >= 0) ? "checked" : "",
			travel: (interests.indexOf("travel") >= 0) ? "checked" : "",
			sports: (interests.indexOf("sport") >= 0) ? "checked" : "",
			music: (interests.indexOf("music") >= 0) ? "checked" : "",
			hiking: (interests.indexOf("hiking") >= 0) ? "checked" : "",
			books: (interests.indexOf("books") >= 0) ? "checked" : ""
		}

		content.ages = {min: req.user.preferences.ages[0], max: req.user.preferences.ages[1]};
		content.user.bio = (req.user.bio) ? req.user.bio : "";
		res.render("profile", content);
	});

}