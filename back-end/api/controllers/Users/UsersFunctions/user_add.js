const bcrypt = require('bcryptjs');
const User = require('../../../models/User');
const mongoose = require('mongoose');

exports.makeid = function (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


 exports.create_user = function (username, passwd, email, quota, api_key, res, next){
    
    // create the user
    // -------------------------------------------------
    bcrypt.hash(passwd, 10, (err, hash) => { 
        if(err) next(err) ;
        else{
            // no error therefore store the pass
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: username,
                passwd: hash,
                email: email,
                quota: quota,
                quota_limit: quota,
                api_key: api_key
            });
            
            // save the user to the db
            user.save().then(result => {
                res.status(201).json({
                    api_key: api_key
                });
            })
            .catch(err => {
                console.log(err);
                next(err)
            });
        }
    });
    // -------------------------------------------------
 }