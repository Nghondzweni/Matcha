// var express = require('express');
const db_connect = require('../../app');
module.exports.registerFunction = function registerFunction(req, res, params)
{
    var check = "SELECT * FROM `users` WHERE email = '" + params.email +"' OR username = '" + params.username + "'"
    db_connect.db.query(check, function(error, results) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if(results)
      {
        if(results[0].email === params.email)
        {
          req.session.error_msg = "email already exists";
        }
        if(results[0].username ===  params.username)
        {
          req.session.error_msg = "username already exists";
        }
        if(results[0].email === params.email && results[0].username === params.username)
        {
            console.log('3rd error');
        }
        console.log(req.session.error_msg);      
      }
      else
        console.log('User does not exist in database. Ready to register');
    });
    res.end();
}