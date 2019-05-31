var User = require("../../../models/users");

module.exports.getProfile = async function (req, res, content){
    User.findOne({_id: req.user._id}, function(err, preferences){
        content.isAuthenticated = req.isAuthenticated();
        if (req.user.images)
                content.profileImg =  (req.user.gender == "male") ? "img/male.png" : "img/female.jpeg";
    
    
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