var userFunc = require("../public/js/functions/profileFunctions");
var User = require("../models/users");




module.exports.profile = function(req, res) {
  var content = {
    title : "Profile",
    css : ["profile"],
    js : ["profile"], 
    user : req.user,
    preferences:req.user.preferences
  };
  userFunc.getProfile(req, res, content);
}