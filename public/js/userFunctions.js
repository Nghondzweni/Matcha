const mail = require("../../config/nodemailer");
var User = require("../../models/users");
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var app = require('../../app');
var bcrypt = require('bcryptjs');


module.exports.registerFunction = async function (req, res, params){

    var newUser = new User({
        username : params.username,
        email : params.email,
        password : params.password,
        first_name : params.firstName,
        last_name : params.lastName,
        token : Math.random().toString(13).replace('0.', ''),
        gender : params.gender
    });

    if(await checkDuplicatUser(newUser.username, newUser.email)){
        console.log("failed user duplicate found")
        req.flash('error_msg', "Registration Failed. User Already Exists!!!");
        res.redirect('/register');
    }
    else{
        User.createUser(newUser, function(err, user){
            if(err){
                throw(err);
            }
            console.log("Success: \n" + user);
        })
        sendVerificationMail(params, newUser.token);
        req.flash('success_msg', "Your account has not yet been verified. \n Please check your emails to verify account");
        res.redirect('/login');
    }

}

function sendVerificationMail(params, key) {

    var message = "\
    <h1>Account Verification</h1><br>\
    Welcome to Matcha "+ params.first_name +".<br><br>\
    Get ready to meet your soulmate. Please verify your email address by clicking on the link below:<br>\
    <a href='http://localhost:3000/verification/"+ params.username +"/"+ key +"'>Verify Account</a>\
    ";
    var subject = "Matcha Profile Verification";
    mail.transporter.sendMail(mail.helperOptions(params.email, subject, message), (error, info) =>{
    if(error)
      console.log(error);
    console.log("Verification email sent");
  })
}

async function checkDuplicatUser(userName, userEmail){
     var duplicatUser = await User.findOne({'username' : userName, 'email' : userEmail});

        if(duplicatUser){
            console.log("iside  user");
            console.log(duplicatUser);
            if(duplicatUser.username === userName || duplicatUser.email === userEmail)
            {
                console.log("User found");
                return(1);
            }
            else
                return(null);
    }
    return(null);
}

module.exports.accountVerification = async function accountVerification(req, res, userName, token){
    
    var user =   await User.findOne({'username' : userName});

    if(user && user.token === token){
        try{
            await User.updateOne({'username' : user.username}, {'verified' : 1});
        }
        catch(err){
            throw err;
        }
        req.flash('success_msg', "Your account has been verified!!");
        res.redirect("/login");
    }
    else
    {
        console.log("bad parameter");
        req.flash('error_msg', "Verification failed, please contact Tsundzukani");
        res.redirect("/register");
    }
  }

module.exports.loginFunction = async function (req, res, params)
{

    var user = await User.findOne({'username' : params.username});
    if(user){
        if(!user.verified)
        {
            req.flash('error_msg', "Login failed, your account has not yet been verified. Please check your emails to verify account");
            res.redirect("/login") 
        }
        else{
        await bcrypt.compare(params.password, user.password, function(err, result){
            if(result){
                req.login(user, function(err){
                    req.flash('success_msg', "Login Successful!!");
                    res.redirect("/home");
                });

            }
            else{
                req.flash('error_msg', "Login failed, wrong credentials. Please try again");
                res.redirect("/login")
            }
        })
        }
    }
    else
        {
            req.flash('error_msg', "Login failed, wrong credentials. Please try again");
            res.redirect("/login") 
        }
}



passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});
