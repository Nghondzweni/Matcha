const db_connect = require('../../app');
const mail = require("../../config/nodemailer");

module.exports.registerFunction = function registerFunction(req, res, params)
{
  
  req.session.error_msg  = null;
  let verificationKey = Math.random().toString(13).replace('0.', '');
  // console.log("This is your verification key: " + verificationKey);
  
    var check = "SELECT * FROM `users` WHERE email = '" + params.email +"' OR username = '" + params.username + "'"
    db_connect.db.query(check, function(error, results) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if(results[0])
      {
        if(results[0].email === params.email)
        {
          req.session.error_msg = "email address already exists";
        }
        else if(results[0].username ===  params.username)
        {
          req.session.error_msg = "username already exists";
        }
        res.redirect("/register")
      }
      else
      {
        var insert = "INSERT INTO `users` (email, username, password, first_name, last_name, gender, token)\
        VALUES ('" + params.email +"', '" + params.username +"', '" + params.password +"', '" + params.first_name +"', '" + params.last_name +"', '" + params.gender +"', '"+ verificationKey +"')";
        
        db_connect.db.query(insert, function (error) {
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          sendVerificationMail(params, verificationKey);
          req.session.success = 'Successfully Registered!! \n Please check your emails to verify your account';
          console.log('User successfully registered');
          res.redirect('/login');
        })
      }
    });
  };
  
  function sendVerificationMail(params, key) {

    var message = "\
    <h1>Account Verification</h1><br>\
    Welcome to Matcha "+ params.first_name +".<br><br>\
    Get ready to meet your soulmate. Please verify your email address by clicking on the link below:<br>\
    <a href='http://localhost:8000/verification/accountVerification/"+ key +"'>Verify Account</a>\
    ";
    var subject = "Matcha Profile Verification";
    mail.transporter.sendMail(mail.helperOptions(params.email, subject, message), (error, info) =>{
    if(error)
      console.log(error);
    console.log("Verification email sent");
      // console.log(info);
  })
}

module.exports.loginFunction = function loginFunction(req, res, params)
{
  var check = "SELECT * FROM `users` WHERE email = '" + params.email +"' AND password = '" + params.password + "'"
  db_connect.db.query(check, function(error, results) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    if(results[0])
    {
      if(results[0].verified == 0)
      {
        res.render("login", {error_msg: "Your account has not yet been verified. \n Please check your emails to verify account"});
        return;
      }
      req.session.user_id = results[0].user_id;
      req.session.username = results[0].username;
      req.session.email = results[0].email;
      req.session.first_name = results[0].first_name;
      req.session.last_name = results[0].last_name;

      res.redirect("/home");
    }
    else
    {
      res.render("login", {error_msg: "Incorrect login information entered. Please try again"});
    }
  })
}

module.exports.logoutFunction = function logoutFunction(req, res)
{
  if(req.session.user_id)
  {
    req.session.destroy();
    console.log('session destroyed');
  }
  res.redirect("/home");
}

module.exports.accountVerification = function accountVerification(req, res, key){
  var sql = "SELECT * FROM users WHERE token = '"+ key +"'";
  var verify  = "UPDATE `users` SET `verified` = 1 WHERE `token` = '"+ key +"'";
  db_connect.db.query(sql, function(error, results) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    if(results[0])
    {
      db_connect.db.query(verify, function(error, results) {
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
      })
      req.session.success = 'Your account has been verified';
      res.redirect("/login");
    }
  })
}