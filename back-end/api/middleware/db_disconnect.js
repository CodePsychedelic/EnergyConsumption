const errors = require('../../errors/errors');



// -------------------------------------------------------------------------------------------------------------------------------
module.exports = (req, res, next) => {  
    const mongoose = require('mongoose');   // mongoose for mongoDB
    if(mongoose.connection.readyState === 1){
        mongoose.connection.close();
    }
}
// -------------------------------------------------------------------------------------------------------------------------------