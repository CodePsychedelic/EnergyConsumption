

db.DayAheadTotalLoadForecast.aggregate([

// from forecast, match records
{$match: {'AreaName':'Greece','Year':2018,'ResolutionCodeId':2}},

{$group: {
    _id: {Year:"$Year", Month:"$Month"},                    // group y-m 
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
           
              {     $group:{    
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