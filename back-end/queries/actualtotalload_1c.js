db.ActualTotalLoad
.aggregate([
   { $match: {AreaName:"Greece", Year: 2018, ResolutionCodeId: 2} },
   
   { $group: { 
           _id: {Year:"$Year",Month:"$Month"},     // group by this combination
           total: { $sum: "$TotalLoadValue" },                // sum the load of each day    
           count: { $sum: 1}                                  // count (PT?)
       } 
   },
   
   { $sort : { _id:1 } }                                     // SORT by using the group by id 
])

