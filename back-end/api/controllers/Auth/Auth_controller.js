const User = require('../../models/User');
const BlackListToken = require('../../models/BlackListedToken');
const errors = require('../../../errors/errors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// login will check if user has entered correct credentials
// if correct credentials then a JWT token will be returned
// else NOT_AUTH errors
// ===================================================================================================
exports.user_login = (req, res, next) => {
    const username = req.body.username;
    const passw = req.body.passw;
    console.log(username);

    if(username === undefined || passw === undefined){
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = "Missing required parameters - username or password"
        next(err);
        return;
    }

    User.findOne({username: username}).exec()
    .then(user_doc => {
        if(user_doc === null){
            let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
            err.additional = "Username or password error";
            next(err);
            mongoose.connection.close();            
        }else{
            try{
              
                let ok = bcrypt.compareSync(passw, user_doc.passwd);
                if(ok){
                    // correct credentials - create jwt token for the user, and return it
                    // -------------------------------------------------------------
                    console.log(username + " " + passw);
                    const token = 
                    jwt.sign({
                        username: user_doc.username,
                        email: user_doc.email,
                        role: user_doc.role
                    }, 
                    process.env.JWT_KEY || 'secret',
                    {
                        expiresIn: "2h"
                    });

                    res.status(200).json({
                        token: token
                    });
                    mongoose.connection.close();
                    // -------------------------------------------------------------
                }else{
                    let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
                    err.additional = "Username or password error";
                    next(err);
                    mongoose.connection.close();
                }
            }catch(bcrypt_err){
                let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                err.additional = "Internal error";
                next(err);
                mongoose.connection.close();            
            }
        }
    })
    .catch(db_err => {
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = db_err;
        next(err);
        mongoose.connection.close();    
    });
    
}
// ===================================================================================================




// logout will add the user token, if it valid, to the blacklisted token list
// Tokens that are in the blacklist list, are not time expired, but user expired
// (the user logged out). Therefore it is a way of knowing that the logged out token
// is not valid
// ===================================================================================================
exports.user_logout = (req, res, next) => {
    //console.log(new Date(req.verified.exp * 1000) + " vs " + new Date());
    
    // create a blacklist token doc to save
    let blackListToken = new BlackListToken({
        _id : new mongoose.Types.ObjectId(),
        Token: req.headers.x_observatory_auth,
        expAt: new Date(req.verified.exp * 1000)    // expires at value (date). Will be automatically deleted (hope)
    });

    blackListToken.save()
    .then(() => {
        res.status(200).json({});       // return 200-ok with empty json body in success
        mongoose.connection.close();
    })
    .catch(db_err => {
        // database error (save)
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = db_err;
        next(db_err);
        mongoose.connection.close();
    });
     
}
// ===================================================================================================