db.getCollection("ActualTotalLoad")
.aggregate()
.find({AreaName:"Greece", Year: 2018, Month:1, Day:4, ResolutionCodeId: 2, AreaTypeCodeId: 3})
.sort({DateTime:1})

