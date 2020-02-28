const mongoose = require('mongoose');

const blackListToken = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    Token: {type: String, required: true},
    expAt: {type: Date, expires: 0}         // token expires at date: expAt
},{collection: "BlackListTokens"});



// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('BlackListToken',blackListToken);
