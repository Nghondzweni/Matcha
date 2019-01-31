const db_connect = require('../../app');

module.exports.executeModifyInfo = function(req, res, params)
{
    req.session.error_msg = null;
    if(params.username)
    {
        var sql = "UPDATE `users` SET username = '" + params.username + "' WHERE user_id = '" + req.session.user_id + "'"
        db_connect.db.query(sql, function(error, results){
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
              }
        })
    }
    if(params.email)
    {
        var sql = "UPDATE `users` SET email = '" + params.email + "' WHERE user_id = '" + req.session.user_id + "'"
        db_connect.db.query(sql, function(error, results){
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
              }
        })
    }

    if(params.password)
    {
        var sql = "UPDATE `users` SET first_name = '" + params.password+ "' WHERE user_id = '" + req.session.user_id + "'"
        db_connect.db.query(sql, function(error, results){
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
              }
        })
    }

    if(params.first_name)
    {
        var sql = "UPDATE `users` SET first_name = '" + params.first_name + "' WHERE user_id = '" + req.session.user_id + "'"
        db_connect.db.query(sql, function(error, results){
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
              }
        })
    }
    if(params.last_name)
    {
        var sql = "UPDATE `users` SET last_name = '" + params.last_name + "' WHERE user_id = '" + req.session.user_id + "'"
        db_connect.db.query(sql, function(error, results){
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
              }
        })
    }
    req.session.destroy();
    res.redirect("../../users/login");
}