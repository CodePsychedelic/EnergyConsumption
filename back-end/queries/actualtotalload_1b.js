db.ActualTotalLoad
.aggregate([
   { $match: {AreaName:"Greece", Year: 2018, Month:1, ResolutionCodeId: 2, AreaTypeCodeId: 3} },
   
   { $group: { 
           _id: {Year:"$Year",Month:"$Month",Day:"$Day"},     // group by this combination
           total: { $sum: "$TotalLoadValue" },                // sum the load of each day    
           count: { $sum: 1}                                  // count (PT?)
       } 
   },
   
   { $sort : { _id:1 } },                                      // SORT by using the group by id 
])



