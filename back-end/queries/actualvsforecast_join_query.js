db.DayAheadTotalLoadForecast.aggregate([

{$match: {'AreaName':'Greece','Year':2018,'Month':1,'Day':4,'ResolutionCodeId':2}},
{$sort: {'DateTime':1}},



{
  $lookup:
    {
       from: 'ActualTotalLoad',
       let: { actual_areaname: '$AreaName', actual_datetime: '$DateTime', actual_rcid: '$ResolutionCodeId'},
       // pipeline start
       // -------------------------------------------------------------------------
       pipeline:[ 
           {    $match:
               {    $expr:
                   {     $and:
                           [
                               { $eq: ["$AreaName", "$$actual_areaname"] },
                               { $eq: ["$DateTime", "$$actual_datetime"] },
                               { $eq: ["$ResolutionCodeId", "$$actual_rcid"] }
                           ]
                   }
               }
           },
           //{ $project: {AreaName: 1, DateTime:1, ResolutionCodeId:1, TotalLoadValue:1}}
           { $project: {TotalLoadValue:1}}
       ],
       // -------------------------------------------------------------------------
       // pipeline end  
       as: 'ForActualTotalLoad'
    }
},

 { $project: {TotalLoadValue:1, ForActualTotalLoad:1, DateTime:1, UpdateTime:1}}




]) 