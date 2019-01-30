module.exports.home = function(req,res){
    res.render("home", 
    {
      title: "Home",
      success: req.session.success,
      errors: req.session.errors,
      user_id: req.session.user_id,
      username : req.session.username,
      email : req.session.email,
      first_name : req.session.first_name,
      last_name : req.session.last_name
    });
}