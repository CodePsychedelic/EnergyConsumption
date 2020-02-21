const mongoose = require('mongoose');


/*
Id	
EntityCreatedAt	
EntityModifiedAt	
AreaTypeCodeText	
AreaTypeCodeNote

*/
const areaTypeCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    Id: {type: Number, required: true},
    EntityCreatedAt: { type: Date, required: true }, 
    EntityModifiedAt: { type: Date, required: true },
    AreaTypeCodeText: { type: String, required: true },
    AreaTypeCodeNote: { type: String, required: true }
},{collection: "AreaTypeCode"});


// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('AreaTypeCode',areaTypeCodeSchema);
