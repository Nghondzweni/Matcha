var  mongoose =  require('mongoose');
const config = require('../config/database');
var bcrypt = require('bcryptjs');

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true});
var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    username : {
        type : String,
        index : true,
        unique : true
    },
    password : {
        type : String
    },
    email : {
        type : String,
        index : true,
        unique : true
    },
    first_name : {
        type : String
    },
    last_name : {
        type : String
    },
    gender : {
        type : String,
        enum : ['Male' , 'Female'],
        required : true
    },
    active:
    {
        type: Number,
        default: 0
    },
    token : {
        type : String
    },
    verified : {
        type : Boolean,
        default : 0
    }
})

var User =  module.exports = mongoose.model('User', UserSchema);



module.exports.createUser = function(newUser, username, email, callback){

    bcrypt.genSalt(10 , function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
            
        });
    });
}
