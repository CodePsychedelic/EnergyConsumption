
// responses functions
const responses = require('./ActualvsForecastFunctions/responses');
const responses_4a = require('./ActualvsForecastFunctions/responses_4a');
const responses_4b = require('./ActualvsForecastFunctions/responses_4b');
const responses_4c = require('./ActualvsForecastFunctions/responses_4c');

// models needed
const DayAheadTotalLoadForecast = require('../../models/DayAheadTotalLoadForecast');
const MapCode = require('../../models/MapCode');
const AreaTypeCode = require('../../models/AreaTypeCode');
const ResolutionCode = require('../../models/ResolutionCode');

const errors = require('../../../errors/errors');


// 4a - join query 
// ============================================================================================================================================================================
q4a_query = function (areaname, y, m, d, rcode){
    return DayAheadTotalLoadForecast.aggregate([

        {$match: {'AreaName':areaname,'Year':Number(y),'Month':Number(m),'Day':Number(d),'ResolutionCodeId': rcode}},   // get doc from DAYAHEAD
        {$sort: {'DateTime':1}},                                                                                        // sort by datetime of doc
        {
            $lookup:
            {
                from: 'ActualTotalLoad',                                                                                // from ACTUAL
                let: { actual_areaname: '$AreaName', actual_datetime: '$DateTime', actual_rcid: '$ResolutionCodeId'},   // keep AreaName, DateTime, ResCodeId of ACTUAL 
                // pipeline start
                // -------------------------------------------------------------------------
                pipeline:[ 
                    {    $match:
                        {    $expr:
                            {     $and:
                                [
                                    { $eq: ["$AreaName", "$$actual_areaname"] },                                        // DayAhead(AreaName) === Actual(AreaName)
                                    { $eq: ["$DateTime", "$$actual_datetime"] },                                        // DayAhead(DateTime) === Actual(Datetime)
                                    { $eq: ["$ResolutionCodeId", "$$actual_rcid"] }                                     // DayAhead(ResCodeId) === Actual(ResCodeId)
                                ]
                            }
                        }
                    },
                    { $project: {TotalLoadValue:1}}                                                                      // we only need actual load
                ],
                // -------------------------------------------------------------------------
                // pipeline end  
                as: 'ForActualTotalLoad'
            }
        },
        { $project: {TotalLoadValue:1, ForActualTotalLoad:1, DateTime:1, UpdateTime:1}}              
    ])
}
// ============================================================================================================================================================================

// 4b - join query
// ============================================================================================================================================================================
q4b_query = function (areaname, y, m, rcode){
    return DayAheadTotalLoadForecast.aggregate([

    {$match: {'AreaName':areaname,'Year':Number(y),'Month':Number(m),'ResolutionCodeId':rcode}},
    
    {$group: {
        _id: {Year:"$Year", Month:"$Month", Day:"$Day"}, 
        total: {$sum: "$TotalLoadValue"}, 
        count: {$sum: 1}, 
        AreaName: {$first: "$AreaName"},
        ResolutionCodeId: {$first: "$ResolutionCodeId"}
        }
    },
    
    {$sort: {_id:1}},
    
    {
    $lookup:
        {
        from: 'ActualTotalLoad',
        let: { actual_areaname: '$AreaName', actual_y: '$_id.Year', actual_m: '$_id.Month', actual_d:'$_id.Day', actual_rcid: '$ResolutionCodeId'},
        // pipeline start
        // -------------------------------------------------------------------------
        pipeline:[ 
            {    $match:
                {    $expr:
                    {     $and:
                            [
                                { $eq: ["$AreaName", "$$actual_areaname"] },
                                { $eq: ["$Year", "$$actual_y"] },
                                { $eq: ["$Month", "$$actual_m"] },
                                { $eq: ["$Day", "$$actual_d"] },
                                { $eq: ["$ResolutionCodeId", "$$actual_rcid"] },
                                
                            ]
                    }
                }
            },
            
            {   $group:{    
                    _id: {Year:"$Year", Month:"$Month", Day:"$Day"}, 
                    total: {$sum: "$TotalLoadValue"}, 
                    count: {$sum: 1}, 
                }
            },
            
            {$project: {_id:1, total:1}}
            
        ],
        // -------------------------------------------------------------------------
        // pipeline end  
        as: 'ForActualTotalLoad'
        }
    },
    
    { $project: {_id:1, total:1, ForActualTotalLoad:1}}    
    ]) 
}
// ============================================================================================================================================================================

// 4c - join query
// ============================================================================================================================================================================
q4c_query = function(areaname, y, rcode){
    

    return DayAheadTotalLoadForecast.aggregate([

        // from forecast, match records
        {$match: {'AreaName':areaname,'Year':Number(y),'ResolutionCodeId':rcode}},
        
        {$group: {
            _id: {Year:"$Year", Month:"$Month"},                    // group y-m 
            total: {$sum: "$TotalLoadValue"},                       
            count: {$sum: 1}, 
            AreaName: {$first: "$AreaName"},
            ResolutionCodeId: {$first: "$ResolutionCodeId"}
            }
        },
        
        {$sort: {_id:1}},
        
        {$lookup:
            {
            // go find from actualtotalload the y-m for areaname with rcode. Add it's monthly values
            from: 'ActualTotalLoad',
            let: { actual_areaname: '$AreaName', actual_y: '$_id.Year', actual_m: '$_id.Month', actual_rcid: '$ResolutionCodeId'},
            // pipeline start
            // -------------------------------------------------------------------------
            pipeline:[ 
                {    $match:
                    {    $expr:
                        {     $and:
                                [
                                    { $eq: ["$AreaName", "$$actual_areaname"] },
                                    { $eq: ["$Year", "$$actual_y"] },
                                    { $eq: ["$Month", "$$actual_m"] },
                                    { $eq: ["$ResolutionCodeId", "$$actual_rcid"] },
                                    
                                ]
                        }
                    }
                },
                
                {   $group:{    
                        _id: {Year:"$Year", Month:"$Month"}, 
                        total: {$sum: "$TotalLoadValue"}, 
                        count: {$sum: 1}, 
                    }
                },
                
                {$project: {_id:1, total:1}}
                
            ],
            // -------------------------------------------------------------------------
            // pipeline end  
            as: 'ForActualTotalLoad'
            }
        },
        
        { $project: {_id:1, total:1, ForActualTotalLoad:1}}
        
    ])     
}
// ============================================================================================================================================================================
// join functions
// ******************************************************************************************************************************************************
// query function
exports.query = function (areaname, rescode, data_format, group, tokens, res, next){

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
                    // y/m/d defined
                    // ===================================================================================================================================
                    if(group === 'date'){
                        
                        q4a_query(areaname, tokens[0], tokens[1], tokens[2], resolutioncode_doc.Id)
                        .then(documents => {
                            if(documents.length === 0){
                                next(errors.NO_DATA);
                                return;
                            }
                            else{
                                responses.generateResponse(documents,data_format,responses_4a,process.env.DOWNLOADS + '/ActualvsForecast/ActualvsForecast_4a.csv',{
                                    source: 'entso-e',
                                    dataset: 'ActualVSForecastedTotalLoad',
                                    areaname: areaname,
                                    areatypecode_doc: areatypecode_doc,
                                    mapcode_doc: mapcode_doc,
                                    rescode: rescode,
                                    y: tokens[0],
                                    m: tokens[1],
                                    d: tokens[2]
                                },res);
                            }
                        }).catch(actualvsforecast_err => next(actualvsforecast_err)); 
                        
                    }
                    // ===================================================================================================================================
                    
                    // d === null, m !== null
                    // group by y,m,d
                    // ===================================================================================================================================
                    else if(group === 'month'){
                        q4b_query(areaname, tokens[0], tokens[1], resolutioncode_doc.Id)
                        .then(documents => {
                            if(documents.length === 0){
                                next(errors.NO_DATA);
                                return;
                            }else{
                                console.log(documents);
                                responses.generateResponse(documents,data_format,responses_4b,process.env.DOWNLOADS + '/ActualvsForecast/ActualvsForecast_4b.csv',{
                                    source: 'entso-e',
                                    dataset: 'ActualVSForecastedTotalLoad',
                                    areaname: areaname,
                                    areatypecode_doc: areatypecode_doc,
                                    mapcode_doc: mapcode_doc,
                                    rescode: rescode,
                                    y: tokens[0],
                                    m: tokens[1]
                                },res);
                            }
                        })
                        .catch(documents_err => next(documents_err));
                    }
                    // ===================================================================================================================================
                    // d === null, m === null and y !== null
                    // ===================================================================================================================================
                    else if(group === 'year'){
                        q4c_query(areaname,tokens,resolutioncode_doc.Id)
                        .then(documents => {    
                                if(documents.length === 0) next(errors.NO_DATA);
                                else{
                                    responses.generateResponse(documents,data_format,responses_4c,process.env.DOWNLOADS + '/ActualvsForecast/ActualvsForecast_4c.csv',{
                                        source: 'entso-e',
                                        dataset: 'ActualVSForecastedTotalLoad',
                                        areaname: areaname,
                                        areatypecode_doc: areatypecode_doc,
                                        mapcode_doc: mapcode_doc,
                                        rescode: rescode,
                                        y: tokens
                                    },res);
                                }
                            }).catch(actualtotalload_err => next(actualtotalload_err));    
                    }
                    // ===================================================================================================================================
                }).catch(areatypecode_err => next(areatypecode_err));
            }).catch(mapcode_err => next(mapcode_err));
        }).catch(areaname_err => next(areaname_err));
    }).catch(resolutioncode_err => next(resolutioncode_err));    // end ResolutionCode block
    // ------------------------------------------------------------------------------------------------------------------------------------




}

