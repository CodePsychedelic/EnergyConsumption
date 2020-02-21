const mongoose = require('mongoose');
/* 

Id	
EntityCreatedAt	
EntityModifiedAt	
ProductionTypeText	
ProductionTypeNote


*/

const productionTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    Id: {type: Number, required: true},
    EntityCreatedAt: { type: Date, required: true }, 
    EntityModifiedAt: { type: Date, required: true },
    ProductionTypeText: { type: String, required: true },
    ProductionTypeNote: { type: String, required: true }
},{collection: "ProductionType"});


// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('ProductionType',productionTypeSchema);
