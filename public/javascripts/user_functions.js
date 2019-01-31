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
          res.redirect("register")
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
  var check = "SELECT * FROM `users` WHERE email = '" + params.email +"' AND password = '" + params.password + "'"
  db_connect.db.query(check, function(error, results) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    if(results[0])
    {
      req.session.user_id = results[0].user_id;
      req.session.username = results[0].username;
      req.session.email = results[0].email;
      req.session.first_name = results[0].first_name;
      req.session.last_name = results[0].last_name;

      res.redirect("home");
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
  res.redirect("/users/home");
}