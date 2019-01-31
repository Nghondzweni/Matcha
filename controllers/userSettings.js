var userFunctions = require('../public/javascripts/user_details_modification');

module.exports.modifyInfo = function(req, res){

  res.render("settings", 
  {
    title: "Modify User Information",
    success: req.session.success,
    errors: req.session.errors,
    duplicate_errors: req.session.error_msg 
  });
  req.session.error_msg  = null;
  req.session.errors = null;
  req.session.success = null;
}

module.exports.executeModifyInfo = function(req, res){
  var params = {
    username : req.body.username,
    email : req.body.email,
    username : req.body.password,
    first_name : req.body.first_name,
    last_name : req.body.last_name
  }
  userFunctions.executeModifyInfo(req, res, params);
}