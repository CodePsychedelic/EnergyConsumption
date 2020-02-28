const mongoose = require('mongoose');




const actualTotalLoadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    Id: {type: Number, required: true, unique: true},
    EntityCreatedAt: { type: Date, required: true }, 
    EntityModifiedAt: { type: Date, required: true },
    ActionTaskID: { type: Number, required:true },
    Status: { type: String, required:true },

    Year: { type: Number, required:true },
    Month: { type: Number, required:true },
    Day: { type: Number, required:true },
    DateTime: { type: Date, required:true },
    AreaName: { type: String, required:true },
    UpdateTime: { type: Date, required:true },
    TotalLoadValue: { type: Number, required:true },
    
    AreaTypeCodeId: { type: Number, required:true },                 // ID of AreaTypeCode model
    AreaCodeId: { type: Number, required:true },             // ID of AllocatedEICDetail model
    ResolutionCodeId: { type: Number, required:true },           // ID of ResolutionCode model
    MapCodeId: { type: Number, required:true },                         // ID of MapCode model

    RowHash: { type: String, required:true }
    
},{collection: 'ActualTotalLoad'});


// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('ActualTotalLoad', actualTotalLoadSchema);
