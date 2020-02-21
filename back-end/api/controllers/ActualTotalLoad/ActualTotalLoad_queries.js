const ActualTotalLoad = require('../../models/ActualTotalLoad');
const MapCode = require('../../models/MapCode');
const AreaTypeCode = require('../../models/AreaTypeCode');
const ResolutionCode = require('../../models/ResolutionCode');


const responses = require('./ActualTotalLoadFunctions/responses');
const responses_1a = require('./ActualTotalLoadFunctions/responses_1a');
const responses_1b = require('./ActualTotalLoadFunctions/responses_1b');
const responses_1c = require('./ActualTotalLoadFunctions/responses_1c');


const errors = require('../../../errors/errors');


exports.query = function (areaname, rescode, data_format, group, tokens, res, next){
    // get resolution code id from ResolutionCodetext (it's given in the uri {rescode})
    ResolutionCode.findOne({"ResolutionCodeText": rescode})
    .then(resolutioncode_doc => {
        if(resolutioncode_doc === null) {
            next(errors.NO_DATA);
            return;
        }
        ActualTotalLoad.findOne({"AreaName": areaname}).then(areaname_doc => {
            if(areaname_doc === null) {
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
                    
                    // some rng for file name
                    const now = new Date();
                    const n_fy = now.getFullYear();
                    const n_month = now.getMonth() + 1;
                    const n_day = now.getDate() + 1;
                    
                    
                    // doc query by date
                    // ------------------------------------------------------------------------------------------------------------------------------
                    if(group === 'date'){
                        ActualTotalLoad.find({"Year": tokens[0], "Month": tokens[1], "Day": tokens[2], "AreaName": areaname, "ResolutionCodeId": resolutioncode_doc.Id})
                        .select('DateTime UpdateTime TotalLoadValue')
                        .sort({DateTime:1})
                        .then(documents => {
                            if(documents.length === 0) next(errors.NO_DATA);
                            else{     
                                const path = './files/ActualTotalLoad/ActualTotalLoad_1a_' + n_fy + "-" + n_month + "-" + n_day + "-" + now.getMilliseconds() + ".csv";
                                responses.generateResponse(documents,data_format,responses_1a,path,{
                                    source: 'entso-e',
                                    dataset: 'ActualTotalLoad',
                                    areaname: areaname,
                                    areatypecodetext: areatypecode_doc.AreaTypeCodeText,
                                    mapcodetext: mapcode_doc.MapCodeText,
                                    rescode: rescode,
                                    y: tokens[0],
                                    m: tokens[1],
                                    d: tokens[2]
                                },res);
                            }
                        }).catch(actualtotalload_err => next(actualtotalload_err));    
                    }
                    // ------------------------------------------------------------------------------------------------------------------------------

                    // doc query by month
                    // ------------------------------------------------------------------------------------------------------------------------------
                    else if(group === 'month'){
                        ActualTotalLoad.aggregate([
                            { $match: {"AreaName": areaname, "Year": Number(tokens[0]), "Month": Number(tokens[1]), "ResolutionCodeId": resolutioncode_doc.Id} },
                            
                            { $group: { _id: {Year:"$Year",Month:"$Month",Day:"$Day"}, total: { $sum: "$TotalLoadValue" }, count: {$sum: 1} } },
                            
                            { $sort : { _id:1 } }
                            

                        ]).then(documents => {
                            if(documents.length === 0) next(errors.NO_DATA);
                            else{
                                const path = './files/ActualTotalLoad/ActualTotalLoad_1b_' + n_fy + "-" + n_month + "-" + n_day + "-" + now.getMilliseconds() + ".csv";
                                responses.generateResponse(documents,data_format,responses_1b,path,{
                                    source: 'entso-e',
                                    dataset: 'ActualTotalLoad',
                                    areaname: areaname,
                                    areatypecodetext: areatypecode_doc.AreaTypeCodeText,
                                    mapcodetext: mapcode_doc.MapCodeText,
                                    rescode: rescode,
                                    y: tokens[0],
                                    m: tokens[1]
                                },res);
                            }                        
                        }).catch(actualtotalload_err => next(actualtotalload_err));


                    }
                    // ------------------------------------------------------------------------------------------------------------------------------
                    
                    // doc query by year
                    // ------------------------------------------------------------------------------------------------------------------------------
                    else if(group === 'year'){
                        ActualTotalLoad.aggregate([
                            { $match: {"AreaName": areaname, "Year": Number(tokens), "ResolutionCodeId": resolutioncode_doc.Id} },
                            
                            { $group: { _id: {Year:"$Year",Month:"$Month"}, total: { $sum: "$TotalLoadValue" }, count: {$sum: 1} } },
                            
                            { $sort : { _id:1 } }
                        ]).then(documents => {
                            if(documents.length === 0) next(errors.NO_DATA);
                            else{
                                const path = './files/ActualTotalLoad/ActualTotalLoad_1c_' + n_fy + "-" + n_month + "-" + n_day + "-" + now.getMilliseconds() + ".csv";
                                responses.generateResponse(documents,data_format,responses_1c,path,{
                                    source: 'entso-e',
                                    dataset: 'ActualTotalLoad',
                                    areaname: areaname,
                                    areatypecodetext: areatypecode_doc.AreaTypeCodeText,
                                    mapcodetext: mapcode_doc.MapCodeText,
                                    rescode: rescode,
                                    y: tokens
                                },res);
                            }  

                        }).catch(actualtotalload_err => next(actualtotalload_err));  
                    }
                    // ------------------------------------------------------------------------------------------------------------------------------

                }).catch(areatypecode_err => next(areatypecode_err));
            }).catch(mapcode_err => next(mapcode_err));
        }).catch(areaname_err => next(areaname_err));
    }).catch(resolutioncode_err => next(resolutioncode_err));  
}