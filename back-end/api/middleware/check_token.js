const errors = require('../../errors/errors');
const User = require('../models/User');
const BlackListToken = require('../models/BlackListedToken');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// used for login route -- user must not have a valid token to login
// ========================================================================================================================================
exports.logged_out = (req, res, next) => {  
    try{

        // check if token provided is valid (valid jwt format, with correct JWT_KEY and not expired)
        const verified = jwt.verify(req.headers.x_observatory_auth, process.env.JWT_KEY || 'secret');   // get credentials

        console.log(req.headers.x_observatory_auth);

        // check if token is blacklisted
        BlackListToken.findOne({Token: req.headers.x_observatory_auth}).exec()
        .then(blackListToken_doc => {
            if(blackListToken_doc === null){
                // token is not blacklisted, therefore it is valid 
                // user DOES NOT need to login       
                let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                err.additional = {};
                err.additional.message = "You already have a valid token";
                err.additional.verified = verified;
                next(err);
                mongoose.connection.close();
                console.log("Already logged in --> no login");
            }else{
                // token is blacklisted
                // user does not have a valid token (blacklisted), user NEEDS to login
                console.log("Logged out --> go to login");
                next();
            }
        })
        .catch(db_err => {
            //console.log(db_err);
            let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
            err.additional = db_err;
            next(err);
            mongoose.connection.close();
        });

    }catch(token_not_valid){
        // user does not have a valid token (either expired or not provided or wrong secret)
        console.log(token_not_valid);
        console.log("Logged out --> go to login");
        next();
    }
};
// ========================================================================================================================================


// used for protected routes -- user needs to be logged in to access protected routes, including logout route
// logged in user: has a valid jwt token. A valid jwt token must not be blacklisted from the logout operation
// ========================================================================================================================================
exports.logged_in = async (req, res, next) => {
    try{
        // check if token provided is valid (valid jwt format, with correct JWT_KEY and not expired)
        const verified = jwt.verify(req.headers.x_observatory_auth, process.env.JWT_KEY || 'secret');   // get credentials
        
        // database check
        let user_doc = await User.findOne({username: verified.username});
        if(user_doc === null){
            let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
            err.additional = "The user you speciffy is non existent";
            next(err);
            return;
        }

        // check if token is blacklisted (in case of logout, it will be blacklisted and not expired)
        // ------------------------------------------------------------------------------
        BlackListToken.findOne({Token: req.headers.x_observatory_auth}).exec()
        .then(blackListToken_doc => {
            if(blackListToken_doc === null){
                console.log(blackListToken_doc);
                // it is not blacklisted --> user is logged in and therefore can access the protected route
                req.user_doc = user_doc;           // we will need this in case of quota check
                req.verified = verified;
                next();
                console.log("Logged in --> go to protected route");
            }else{
                // it is blacklisted --> user does not have a valid token
                let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
                err.additional = "You do not have a valid token";
                next(err);    
                mongoose.connection.close();     
            }
        })
        .catch(db_err => {
            let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
            err.additional = db_err;
            next(err);    
            mongoose.connection.close();
        })
        // ------------------------------------------------------------------------------


    }catch(token_not_valid){
        // user does not have a valid format token (either expired or not provided or wrong secret)
        let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
        err.additional = "You do not have a valid token";
        next(err);    
        mongoose.connection.close();
    }
}
// ========================================================================================================================================