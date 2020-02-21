const errors = require('../../errors/errors');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {  
    if(req.verified.role === 'ADMIN' || req.verified.role === 'SUPER') next();
    else{
        let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
        err.additional = 'You need Administrator privileges to access this';
        next(err);
    }
}