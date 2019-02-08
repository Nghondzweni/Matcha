var mysql = require('mysql');
const db_connect = require('../app');

function create_tables(){
  let users_sql = "CREATE TABLE IF NOT EXISTS `users`(`user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  `email` VARCHAR (100) NOT NULL,`username` VARCHAR (30) NOT NULL,\
  `password` VARCHAR (255) NOT NULL,`first_name` VARCHAR (30) NOT NULL,\
  `last_name` VARCHAR (30) NOT NULL, `gender` ENUM('Male', 'Female') NOT NULL,\
  `verified` BOOLEAN NOT NULL DEFAULT 0,`profile_img_url` VARCHAR (255) DEFAULT 'images/default.png',\
  `token` VARCHAR (50) NOT NULL, `biography` VARCHAR (225)\
  )";

  db_connect.db.query(users_sql, function (error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    console.log('Table "Users successfully created"');
  });
}

module.exports.setup = function setup(req, res){
  console.log("databases setup");
  
  let sql = 'CREATE DATABASE IF NOT EXISTS matcha';
  db_connect.adminDB.query(sql, function (error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    
    console.log('Database "matcha" successfully created');
    create_tables();
  });  res.end();
};
