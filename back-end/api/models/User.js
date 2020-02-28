const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    username: {type: String, required: true},
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 
    },
    passwd: {type: String, required: true},
    quota: {type: Number, required:true, default:32},
    quota_limit: {type: Number, required:true, default:32},
    last_refresh: {type: Date, required:true, default:Date()},
    role:{type: String, enum: ['USER','ADMIN','SUPER'], required: true, default: 'USER'}
},{collection: "Users"});


// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('User',userSchema);
