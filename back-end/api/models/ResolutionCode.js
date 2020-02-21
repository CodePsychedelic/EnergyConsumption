const mongoose = require('mongoose');

/*
Id	
EntityCreatedAt	
EntityModifiedAt	
ResolutionCodeText	
ResolutionCodeNote


*/
const resolutionCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    Id: {type: Number, required: true},
    EntityCreatedAt: { type: Date, required: true }, 
    EntityModifiedAt: { type: Date, required: true },
    ResolutionCodeText: { type: String, required: true },
    ResolutionCodeNote: { type: String, required: true }
},{collection: "ResolutionCode"});


// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('ResolutionCode',resolutionCodeSchema);
