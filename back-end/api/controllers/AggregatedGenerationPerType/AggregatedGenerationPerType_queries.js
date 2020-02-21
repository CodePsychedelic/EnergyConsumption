const AggregatedGenerationPerType = require('../../models/AggregatedGenerationPerType');
const MapCode = require('../../models/MapCode');
const AreaTypeCode = require('../../models/AreaTypeCode');
const ResolutionCode = require('../../models/ResolutionCode');
const ProductionType = require('../../models/ProductionType');

const responses = require('./AggregatedGenerationPerTypeFunctions/responses');
const responses_2a = require('./AggregatedGenerationPerTypeFunctions/responses_2a');
const responses_2b = require('./AggregatedGenerationPerTypeFunctions/responses_2b');
const responses_2c = require('./AggregatedGenerationPerTypeFunctions/responses_2c');


const errors = require('../../../errors/errors');


exports.query = function (areaname, rescode, ptype, data_format, group, tokens, res, next){
    // get ProductionTypeId from ProductionTypeText (url)
    let search_opts;

    // models.customer.find({ "abc": { $regex: '.*' + colName + '.*' } },

    if(ptype === 'AllTypes') search_opts = {};
    else search_opts = {"ProductionTypeText": {$regex: ptype + '.*'}};

    // extra step, get the production type document for ptype given
    ProductionType.find(search_opts).sort({Id:1}).then(productiontype_docs => {
        // lenght > 1, or length === 1, or length === 0
        // create seach_opts in accordance with ProductionTypeText given 
        // ------------------------------------------------------------------------------------
        if(productiontype_docs.length > 1 && ptype === 'AllTypes'){
            // more than 1 and ptype given is AllTypes
            search_opts = {};   // we are going to find everything by not restricting speciffic ProductionTypeId
        }else if(productiontype_docs.length > 1 && ptype !== 'AllTypes'){
            // more than 1 and ptype not AllTypes. Create an or clause for the search, 
            // based on productiontype id's that we have from the search with regexp
            let or_clause = [];
            for(var i=0; i<productiontype_docs.length; i++) or_clause[i] = {"ProductionTypeId" : {$eq: productiontype_docs[i].Id}};
            search_opts = {$or: or_clause};
        }else if (productiontype_docs.length === 1){
            // if we found a doc then we are going to restrict with production type id
            search_opts = {"ProductionTypeId":productiontype_docs[0].Id};
        }else{
            // else, no production type found --> 403 error
            next(errors.NO_DATA);
            return;
        }
        // ------------------------------------------------------------------------------------
        console.log(search_opts);
        // make a hashmap 
        // ------------------------------------------------------------------------------------      
        let productiontype_docs_mapped = {};
        productiontype_docs.map(pdoc => {
            return productiontype_docs_mapped[pdoc.Id]=pdoc.ProductionTypeText;
        });
        // ------------------------------------------------------------------------------------
        console.log(productiontype_docs_mapped);
        
        // get resolution code id from ResolutionCodetext (it's given in the uri {rescode}) 
        ResolutionCode.findOne({"ResolutionCodeText": rescode})
        .then(result => {
            if(result === null) {
                next(errors.NO_DATA);
                return;
            }

            AggregatedGenerationPerType.findOne({"AreaName": areaname}).then(areaname_doc => {
                
                const AreaTypeCodeId = areaname_doc.AreaTypeCodeId;  // AreaTypeCodeid to get AreaTypeCodeText
                const MapCodeId = areaname_doc.MapCodeId;    // MapCodeid to get MapCodetext
            
                // get mapcodetext from MapCode collection
                MapCode.findOne({"Id": MapCodeId}).select('MapCodeText')
                .then(mapcode_doc => {
                    // get areatypecodetext from AreaTypeCode collection
                    AreaTypeCode.findOne({"Id": AreaTypeCodeId}).select('AreaTypeCodeText')
                    .then(areatypecode_doc =>{
                        // split operations - NON STANDARD operations
                        // group by date
                        // ===================================================================================================================================
                        if(group === 'date'){ 
                            search_opts.Year = tokens[0]; search_opts.Month = tokens[1]; search_opts.Day = tokens[2]; search_opts.AreaName = areaname; search_opts.ResolutionCodeId = result.Id;
                            
                            AggregatedGenerationPerType.find(search_opts).sort({DateTime:1})
                            .then(documents => {
                                if(documents.length === 0) next(errors.NO_DATA);
                                else{
                                    responses.generateResponse(documents,data_format,responses_2a,'./files/AggregatedGenerationPerType/AggregatedGenerationPerType_2a.csv',{
                                        source: 'entso-e',
                                        dataset: 'AggregatedGenerationPerType',
                                        areaname: areaname,
                                        areatypecode_doc: areatypecode_doc,
                                        mapcode_doc: mapcode_doc,
                                        rescode: rescode,
                                        y: tokens[0],
                                        m: tokens[1],
                                        d: tokens[2],
                                        ProductionType: productiontype_docs_mapped
                                    },res);
                                }
                            }).catch(actualtotalload_err => next(actualtotalload_err));    
                        }
                        // ===================================================================================================================================
                        
                        // group by month
                        // ===================================================================================================================================
                        else if(group === 'month'){
                                search_opts.Year = Number(tokens[0]); search_opts.Month = Number(tokens[1]); search_opts.AreaName = areaname; search_opts.ResolutionCodeId = result.Id;
                                AggregatedGenerationPerType.aggregate([
                                    { $match: search_opts },
                                    
                                    { $group: { _id: {Year:"$Year",Month:"$Month",Day:"$Day", ProductionTypeId: "$ProductionTypeId"}, total: { $sum: "$ActualGenerationOutput" }, count: {$sum: 1} } },
                                    
                                    { $sort : { _id:1 } }
                                    
                                ]).then(documents => {
                                    if(documents.length === 0) next(errors.NO_DATA);
                                    else{
                                        responses.generateResponse(documents,data_format,responses_2b,'./files/AggregatedGenerationPerType/AggregatedGenerationPerType_2b.csv',{
                                            source: 'entso-e',
                                            dataset: 'AggregatedGenerationPerType',
                                            areaname: areaname,
                                            areatypecode_doc: areatypecode_doc,
                                            mapcode_doc: mapcode_doc,
                                            rescode: rescode,
                                            y: tokens[0],
                                            m: tokens[1],
                                            ProductionType: productiontype_docs_mapped
                                        },res);
                                    }                        
                                }).catch(actualtotalload_err => next(actualtotalload_err));
                            
                        }
                        // ===================================================================================================================================
                        
                        // group by year
                        // ===================================================================================================================================
                        else if(group === 'year'){
                            search_opts.Year = Number(tokens); search_opts.AreaName = areaname; search_opts.ResolutionCodeId = result.Id;
                            AggregatedGenerationPerType.aggregate([
                                { $match: search_opts },
                                
                                { $group: { _id: {Year:"$Year",Month:"$Month", ProductionTypeId: "$ProductionTypeId"}, total: { $sum: "$ActualGenerationOutput" }, count: {$sum: 1} } },
                                
                                { $sort : { _id:1 } }
                            ]).then(documents => {
                                if(documents.length === 0) next(errors.NO_DATA);
                                else{
                                    responses.generateResponse(documents,data_format,responses_2c,'./files/AggregatedGenerationPerType/AggregatedGenerationPerType_2c.csv',{
                                        source: 'entso-e',
                                        dataset: 'AggregatedGenerationPerType',
                                        areaname: areaname,
                                        areatypecode_doc: areatypecode_doc,
                                        mapcode_doc: mapcode_doc,
                                        rescode: rescode,
                                        y: tokens,
                                        ProductionType: productiontype_docs_mapped
                                    },res);  
                                }
                            }).catch(actualtotalload_err => next(actualtotalload_err));    
                        }
                        // ===================================================================================================================================
                    }).catch(areatypecode_err => next(areatypecode_err));
                }).catch(mapcode_err => next(mapcode_err));
            }).catch(areaname_err => next(areaname_err));
        }).catch(resolutioncode_err => next(resolutioncode_err));    // end ResolutionCode block
    }).catch(productiontype_err => next(productiontype_err));
    // ------------------------------------------------------------------------------------------------------------------------------------
}