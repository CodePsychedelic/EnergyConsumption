const mongoose = require('mongoose');

/*
Id	
EntityCreatedAt	
EntityModifiedAt	
MapCodeText	
MapCodeNote


*/
const mapCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    Id: {type: Number, required: true},
    EntityCreatedAt: { type: Date, required: true }, 
    EntityModifiedAt: { type: Date, required: true },
    MapCodeText: { type: String, required: true },
    MapCodeNote: { type: String, required: true }
},{collection: "MapCode"});


// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('MapCode',mapCodeSchema);
