const mongoose = require('mongoose');


/*


Id	
EntityCreatedAt	
EntityModifiedAt	
MRID	
DocStatusValue	
AttributeInstanceComponent	
LongNames	
DisplayNames	
LastRequestDateAndOrTime	
DeactivateRequestDateAndOrTime	
MarketParticipantStreetAddressCountry	
MarketParticipantACERCode	
MarketParticipantVATcode	
Description	
EICParentMarketDocumentMRID	
ELCResponsibleMarketParticipantMRID	
IsDeleted	
AllocatedEICID




Id: 47677,
    EntityCreatedAt: '2019-04-01 09:26:51.2053104',
    EntityModifiedAt: '2019-04-01 09:26:51.2053104',
    MRID: '10T-1001-10010AS',
    DocStatusValue: 'A05',
    AttributeInstanceComponent: 'International',
    LongNames: 'Tie Line Koman-KosovoB',
    DisplayNames: 'L_KOM-KOSB',
    LastRequestDateAndOrTime: '2018-10-31 00:00:00.0000000',
    DeactivateRequestDateAndOrTime: 'NULL',
    MarketParticipantStreetAddressCountry: 'NULL',
    MarketParticipantACERCode: '',
    MarketParticipantVATcode: 'NULL',
    Description: 'Tieline',
    EICParentMarketDocumentMRID: 'NULL',
    ELCResponsibleMarketParticipantMRID: '10XAL-KESH-----J',
    IsDeleted: 0,
    AllocatedEICID: 3
  }



*/
const AllocatedEICDetailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    // serial ID type (long string) == ObjectId type
    Id: {type: Number, required: true},
    EntityCreatedAt: { type: Date, required: true }, 
    EntityModifiedAt: { type: Date, required: true },
    MRID: { type: String, required:true },
    DocStatusValue: { type: String, required:true },
    AttributeInstanceComponent: { type: String, required:true },
    LongNames: { type: String, required:true },
    DisplayNames: { type: String, required:false },
    LastRequestDateAndOrTime:{ type: String, required:true},
    DeactivateRequestDateAndOrTime: {type: String, required:true},
    MarketParticipantStreetAddressCountry: {type: String, required:true},
    MarketParticipantACERCode: { type: String, required:false}, 
    MarketParticipantVATcode: { type: String, required:true},
    Description: { type: String, required:true },
    EICParentMarketDocumentMRID: { type: String, required:true },
    ELCResponsibleMarketParticipantMRID: { type: String, required:true },
    IsDeleted: { type: Number, required:true },
    AllocatedEICID: { type: Number, required:true}

},{collection: "AllocatedEICDetail"});


// export it -> call it Product (fist argument) that is based to productSchema (second argument)
module.exports = mongoose.model('AllocatedEICDetail',AllocatedEICDetailSchema);
