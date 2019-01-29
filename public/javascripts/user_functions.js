const db_connect = require('../../app');

module.exports.registerFunction = function registerFunction(req, res, params)
{
    req.session.error_msg  = null;
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
          res.render("register", 
          {
            title: "Registration",
            success: req.session.success,
            errors: req.session.errors,
            duplicate_errors: req.session.error_msg 
          });
      }
      else
      {
        var insert = "INSERT INTO `users` (email, username, password, first_name, last_name, gender)\
        VALUES ('" + params.email +"', '" + params.username +"', '" + params.password +"', '" + params.first_name +"', '" + params.last_name +"', '" + params.gender +"')";
      
        db_connect.db.query(insert, function (error) {
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          req.session.success = 'Successfully Registered!!';
          console.log('User successfully registered');
          res.redirect('/users/login');
        })
      }
    });
};

module.exports.loginFunction = function loginFunction(req, res, params)
{
  req.session.username = null;
  var check = "SELECT * FROM `users` WHERE email = '" + params.email +"' AND password = '" + params.password + "'"
  db_connect.db.query(check, function(error, results) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    if(results[0])
    {
      console.log("success");
      // req.session.destroy();
      req.session.username = "Tsundzukani5";
      // req.session.lastname = "Nghondweni";
      console.log(req.session);
      // console.log("inside function\n");
      res.render("home", 
      {
        title: "Home",
        success: req.session.success,
        errors: req.session.errors,
        username : req.session.username 
      });
    }
    else
    {
      
    }
  })
}