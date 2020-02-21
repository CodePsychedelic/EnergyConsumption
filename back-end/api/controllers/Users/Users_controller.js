const User = require('../../models/User');

const bcrypt = require('bcryptjs');
const errors = require('../../../errors/errors');
const jwt = require('jsonwebtoken');
const user_add_functions = require('./UsersFunctions/user_add');


// user_status searches user by username and returns info if exists
exports.user_status = (req, res, next) => {
    const username = req.params.Username;
    User.findOne({username: username}).then(user_doc => {
        if(user_doc === null) next(errors.USER_NOT_FOUND);  // if user not exists --> USER_NOT_fOUND
        else{
            res.status(200).json({
                username: username,
                email: user_doc.email,
                api_key: user_doc.api_key,
                quota: user_doc.quota
            });
        }
    }).catch(db_err => next(db_err));
}


// user_add adds user to our database. Generates unique api_key for new user
// functions -> user_add.js
exports.user_add = (req, res, next) => {
    const username = req.body.username;
    const passwd = req.body.passwd;
    const email = req.body.email;
    const quota = req.body.quota;

    console.log(username);
    console.log(passwd);
    console.log(email);
    console.log(quota);

    // check if user exists
    //{ $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }
    User.findOne({ $or: [{username: username}, {email: email}] })
    .then(user => {
        if(user !== null) {
            console.log(user);
            next(errors.USER_EXISTS); // if user exists, error
        }
        else{
            // user does not exist. Create XXXX-XXXX-XXXX
            User.find({}).select('api_key').then(api_key_docs => {
                
                // get the api_key_list of our users
                // ------------------------------------------------
                let api_key_list = [];
                api_key_docs.map(api_key_doc => {
                    return api_key_list.push(api_key_doc.api_key);
                });
                // ------------------------------------------------
                
    
                // generate a unique api-key for user
                // ------------------------------------------------
                let api_key = '';
                do{
                    api_key = user_add_functions.makeid(4) + '-' + user_add_functions.makeid(4) + '-' + user_add_functions.makeid(4);
                }
                while(api_key_list.includes(api_key));
                // ------------------------------------------------

                user_add_functions.create_user(username, passwd, email, quota, api_key, res, next); // create the user
            }).catch(db_err => next(db_err));
            
        }
    }).catch(db_err => next(db_err));
    
}


// cool way to make something a promise --> awaitable
/*
async function hashPassword (passwd, saltRounds) {

  
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })
  
    return hashedPassword
  }
*/       

// user_mod modifies user {passwd, email, quota}
exports.user_mod = (req, res, next) => {
    username = req.params.Username;
    User.findOne({username: username})
    .then(user_doc => {
        if(user_doc === null) next(errors.USER_NOT_FOUND);
        else{
            
            // create updateOps for update
            // ---------------------------------------------------------
            updateOps = {};
            for(const option of req.body) {
                if(option.propName === 'passwd') updateOps[option.propName] = bcrypt.hashSync(option.propValue, 10);    // hash passwd in case of passwd update
                else {
                    updateOps[option.propName] = option.propValue;                                                      // else just append
                    if(option.propName === 'quota') updateOps['quota_limit'] = option.propValue;                        // if quota, update quota limit too
                }
            }
            // ---------------------------------------------------------

            console.log(updateOps);
            
            // update user
            // ---------------------------------------------------------
            User.updateOne(
                { username: username },     // update user with given username
                { $set: updateOps }         // using updateOps
            ).exec().then(() => {
                // if update worked, show the updated user
                User.findOne({username: username})
                .then(updated_user_doc => {
                    res.status(200).json(
                        updated_user_doc
                    );
                })
                
            }).catch(db_err => next(db_err));
            // ---------------------------------------------------------
        }
    })
    .catch()
    
}

// user_api_login for user to login using the api_key given. Returns credentials that are encoded to jwt
exports.user_api_login = (req, res, next) => {
    const api_key = req.body.api_key;
    User.findOne({api_key: api_key}).select('username email quota quota_limit last_refresh').then(user_doc => {
        if(user_doc === null) next(errors.USER_NOT_FOUND);
        else {
            console.log(user_doc);
            // generate sign in token for user
            const token = 
            jwt.sign({
                user: user_doc.username,
                email: user_doc.email,
                quota: user_doc.quota,
                quota_limit: user_doc.quota_limit,
                last_refresh: user_doc.last_refresh
            }, 
            process.env.JWT_KEY || 'secret',
            {
                expiresIn: "20s"
            });
        
            res.status(200).json({token: token});
        }
    }).catch(db_err => next(db_err));
}