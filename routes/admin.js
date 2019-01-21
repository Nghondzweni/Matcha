const express = require('express');
const router = express.Router();
var mysql = require('mysql');


// create database and tables

router.get('/setup', (req, res) => {
  var create_db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
  });

  let sql = 'CREATE DATABASE IF NOT EXISTS matcha';
  create_db.query(sql, function (error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    console.log('Database "matcha" successfully created');
  });
  create_db.end();
  
  res.redirect('/admin/create_tables')
  res.end();
});

router.get('/create_tables', (req, res) => {
  var create_tables = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'matcha'
  });

  let users_sql = "CREATE TABLE IF NOT EXISTS `users`(`user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
`email` VARCHAR (100) NOT NULL,`username` VARCHAR (30) NOT NULL,\
`password` VARCHAR (255) NOT NULL,`first_name` VARCHAR (30) NOT NULL,\
`last_name` VARCHAR (30) NOT NULL, `gender` ENUM('Male', 'Female') NOT NULL,\
`verified` BOOLEAN NOT NULL DEFAULT 0,`profile_img_url` VARCHAR (255) DEFAULT 'images/default.png',\
`biography` VARCHAR (225)\
)";

  create_tables.query(users_sql, function (error) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    console.log('Table "Users successfully created"');
  });
  res.end();
})

module.exports = router;