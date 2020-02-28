

db.DayAheadTotalLoadForecast.aggregate([

{$match: {'AreaName':'Greece','Year':2018,'Month':1,'ResolutionCodeId':2}},

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
           
              {     $group:{    
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