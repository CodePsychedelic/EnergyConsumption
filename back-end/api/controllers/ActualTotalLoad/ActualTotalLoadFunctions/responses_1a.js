module.exports = {
    // for json format
    generateResponse_json: function(data,document){
        return {
            Source: data.source,
            Dataset: data.dataset,
            AreaName: data.areaname,
            AreaTypeCode: data.areatypecodetext,
            MapCode: data.mapcodetext,
            ResolutionCode: data.rescode,
            Year: Number(data.y),
            Month: Number(data.m),
            Day: Number(data.d),
            DateTimeUTC: document.DateTime.toISOString().replace('T',' ').replace('Z',''),
            ActualTotalLoadValue: document.TotalLoadValue,
            UpdateTimeUTC: document.UpdateTime.toISOString().replace('T',' ').replace('Z','')
        }
    },

    // for json format
    generateResponse_csv: function (docs,path){
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
        path: path,
        header: [
            //{'Source', 'Dataset', 'AreaName', 'AreaTypeCode', 'MapCode', 'ResolutionCode','Year','Month','Day','DateTimeUTC','ActualTotalLoadValue','UpdateTimeUTC'
            {id: 'Source', title: 'Source'},
            {id: 'Dataset', title: 'Dataset'},
            {id: 'AreaName', title: 'AreaName'},
            {id: 'AreaTypeCode', title: 'AreaTypeCode'},
            {id: 'MapCode', title: 'MapCode'},
            {id: 'ResolutionCode', title: 'ResolutionCode'},
            {id: 'Year', title: 'Year'},
            {id: 'Month', title: 'Month'},
            {id: 'Day', title: 'Day'},
            {id: 'DateTimeUTC', title: 'DateTimeUTC'},
            {id: 'ActualTotalLoadValue', title: 'ActualTotalLoadValue'},
            {id: 'UpdateTimeUTC', title: 'UpdateTimeUTC'}
        
        ],
        fieldDelimiter: ';'
        });
        

        
        return csvWriter
        .writeRecords(docs);
        
        

    }
  };


