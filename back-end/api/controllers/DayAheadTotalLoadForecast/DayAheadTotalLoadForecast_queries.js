// responses functions
const responses = require('./DayAheadTotalLoadForecastFunctions/responses');
const responses_3a = require('./DayAheadTotalLoadForecastFunctions/responses_3a');
const responses_3b = require('./DayAheadTotalLoadForecastFunctions/responses_3b');
const responses_3c = require('./DayAheadTotalLoadForecastFunctions/responses_3c');

// models needed
const DayAheadTotalLoadForecast = require('../../models/DayAheadTotalLoadForecast');
const MapCode = require('../../models/MapCode');
const AreaTypeCode = require('../../models/AreaTypeCode');
const ResolutionCode = require('../../models/ResolutionCode');

const errors = require('../../../errors/errors');


exports.query = function(areaname, rescode, data_format, group, tokens, res, next){

    // get resolution code id from ResolutionCodetext (it's given in the uri {rescode})
    ResolutionCode.findOne({"ResolutionCodeText": rescode})
    .then(resolutioncode_doc => {
        if(resolutioncode_doc === null) {
            console.log('RESCODE NOT FOUND');
            next(errors.NO_DATA);
            return;
        }
        DayAheadTotalLoadForecast.findOne({"AreaName": areaname}).then(areaname_doc => {
            if(areaname_doc === null) {
                console.log('AREANAME NOT FOUND');
                next(errors.NO_DATA);
                return;
            }
            const AreaTypeCodeId = areaname_doc.AreaTypeCodeId;  // AreaTypeCodeid to get AreaTypeCodeText
            const MapCodeId = areaname_doc.MapCodeId;    // MapCodeid to get MapCodetext
        
            // get mapcodetext from MapCode collection
            MapCode.findOne({"Id": MapCodeId}).select('MapCodeText')
            .then(mapcode_doc => {
                // get areatypecodetext from AreaTypeCode collection
                AreaTypeCode.findOne({"Id": AreaTypeCodeId}).select('AreaTypeCodeText')
                .then(areatypecode_doc =>{
                    // split operations - NON STANDARD operations
                    // grouped by date
                    // ===================================================================================================================================
                    if(group === 'date'){ 
                        DayAheadTotalLoadForecast.find({"Year": tokens[0], "Month": tokens[1], "Day": tokens[2], "AreaName": areaname, "ResolutionCodeId": resolutioncode_doc.Id}).sort({DateTime:1})
                        .then(documents => {
                            if(documents.length === 0) {
                                console.log('NO DATA');
                                next(errors.NO_DATA);
                            }
                            else{
                                responses.generateResponse(documents,data_format,responses_3a,'./files/DayAheadTotalLoadForecast/DayAheadTotalLoadForecast_3a.csv',{
                                    source: 'entso-e',
                                    dataset: 'DayAheadTotalLoadForecast',
                                    areaname: areaname,
                                    areatypecode_doc: areatypecode_doc,
                                    mapcode_doc: mapcode_doc,
                                    rescode: rescode,
                                    y: tokens[0],
                                    m: tokens[1],
                                    d: tokens[2]
                                },res);
                            }
                        }).catch(actualtotalload_err => console.log(actualtotalload_err));    
                    }
                    // ===================================================================================================================================
                    
                    // grouped by month
                    // ===================================================================================================================================
                    else if(group === 'month'){
                        
                        DayAheadTotalLoadForecast.aggregate([
                            { $match: {"AreaName": areaname, "Year": Number(tokens[0]), "Month": Number(tokens[1]), "ResolutionCodeId": resolutioncode_doc.Id} },
                            
                            { $group: { _id: {Year:"$Year",Month:"$Month",Day:"$Day"}, total: { $sum: "$TotalLoadValue" }, count: {$sum: 1} } },
                            
                            { $sort : { _id:1 } }
                            

                        ]).then(documents => {
                            if(documents.length === 0) next(errors.NO_DATA);
                            else{
                                responses.generateResponse(documents,data_format,responses_3b,'./files/DayAheadTotalLoadForecast/DayAheadTotalLoadForecast_2b.csv',{
                                    source: 'entso-e',
                                    dataset: 'DayAheadTotalLoadForecast',
                                    areaname: areaname,
                                    areatypecode_doc: areatypecode_doc,
                                    mapcode_doc: mapcode_doc,
                                    rescode: rescode,
                                    y: tokens[0],
                                    m: tokens[1]
                                },res);
                            }                        
                        }).catch(actualtotalload_err => console.log(actualtotalload_err));
                    }
                    // ===================================================================================================================================
                    
                    // grouped by year
                    // ===================================================================================================================================
                    else if(group === 'year'){
                        DayAheadTotalLoadForecast.aggregate([
                            { $match: {"AreaName": areaname, "Year": Number(tokens), "ResolutionCodeId": resolutioncode_doc.Id} },
                            
                            { $group: { _id: {Year:"$Year",Month:"$Month"}, total: { $sum: "$TotalLoadValue" }, count: {$sum: 1} } },
                            
                            { $sort : { _id:1 } }
                        ]).then(documents => {
                            if(documents.length === 0) next(errors.NO_DATA);
                            else{
                                responses.generateResponse(documents,data_format,responses_3c,'./files/DayAheadTotalLoadForecast/DayAheadTotalLoadForecast_3c.csv',{
                                    source: 'entso-e',
                                    dataset: 'DayAheadTotalLoadForecast',
                                    areaname: areaname,
                                    areatypecode_doc: areatypecode_doc,
                                    mapcode_doc: mapcode_doc,
                                    rescode: rescode,
                                    y: tokens
                                },res);
                            }  

                        }).catch(actualtotalload_err => console.log(actualtotalload_err));    
                    }
                    // ===================================================================================================================================
                }).catch(areatypecode_err => console.log(areatypecode_err));
            }).catch(mapcode_err => console.log(mapcode_err));
        }).catch(areaname_err => console.log(areaname_err));
    }).catch(resolutioncode_err => console.log(resolutioncode_err));    // end ResolutionCode block
    // ------------------------------------------------------------------------------------------------------------------------------------

}