var userFunctions = require('../public/javascripts/user_functions');

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