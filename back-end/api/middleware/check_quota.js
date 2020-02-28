const errors = require('../../errors/errors');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
module.exports = async (req, res, next) => {    
    let user_doc = req.user_doc;
    if(user_doc.role === 'SUPER' || user_doc.role === 'ADMIN') next();
    else{
        
        // quota refresh
        // -------------------------------------------------------------------------------
        const now_date = new Date();                                // user is here now
        const last_refresh = new Date(user_doc.last_refresh);   // user last refresh
        
        
        
        console.log(now_date.getFullYear() + " " + last_refresh.getFullYear());
        console.log(now_date.getMonth() + " " + last_refresh.getMonth());
        console.log(now_date.getDate() + " " + last_refresh.getDate());
    

        if( now_date.getFullYear() > last_refresh.getFullYear() || 
            now_date.getMonth() > last_refresh.getMonth() ||
            now_date.getDate() > last_refresh.getDate() )
        {
            // now year will be either same or greater than last refresh
            // if same year, check if month is greater. Month grater or same
            // if same month, check day
            // if any of those apply, refresh quota
            user_doc.quota = user_doc.quota_limit;
            user_doc.last_refresh = now_date;
            console.log('REFRESH!!!!!!!!');
        }
        console.log(user_doc);
        // -------------------------------------------------------------------------------
        

        // quota check
        // ------------------------------------------------------------------------------- 
        if(user_doc.quota > 0) {
            // if user has quota, reduce it
            user_doc.quota -= 1;
        
            // update user quota and last refresh (if refreshed)
            User.updateOne(
                { username: user_doc.username },
                { $set: { quota: user_doc.quota, last_refresh: user_doc.last_refresh }}        
            ).exec()
            .then(() => {
                next(); // proceed to the resource asked
            })
            .catch(db_err => {
                let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                err.additional = db_err;
                next(err);
                mongoose.connection.close();
            });
        } else {
            next(errors.NO_QUOTA);    // if no more quota, error and deny
            mongoose.connection.close();
        }
        
        // -------------------------------------------------------------------------------
            
      
    }
}
