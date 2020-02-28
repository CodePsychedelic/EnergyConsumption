const errors = require('../../errors/errors');
const jwt = require('jsonwebtoken');



// connection middleware. Will be used on all routes that need a DB connection
// -------------------------------------------------------------------------------------------------------------------------------
module.exports = (req, res, next) => {  
    const mongoose = require('mongoose');   // mongoose for mongoDB
  
    if(mongoose.connection.readyState === 1) next();
    else{
        mongoose.set('useCreateIndex', true);

        mongoose.connect(
            //'mongodb://localhost:27017/softeng?readPreference=primary&appname=MongoDB%20Compass&ssl=false',   // environmental variable for pw
            process.env.MONGO_CONNECT,
            { useNewUrlParser: true , useUnifiedTopology: true }    // use new url parser and new monitoring
        ).then(() => {
            next();
        }).catch(conn_err => {
            let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
            err.additional = conn_err.toString();
            next(err);
        });
    }
}
// -------------------------------------------------------------------------------------------------------------------------------