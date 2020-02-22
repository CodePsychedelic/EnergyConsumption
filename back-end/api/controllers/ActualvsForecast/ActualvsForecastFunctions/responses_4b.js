module.exports = {
    // for json format
    generateResponse_json: function(data,document){
        return {
            Source: data.source,
            Dataset: data.dataset,
            AreaName: data.areaname,
            AreaTypeCode: data.areatypecode_doc.AreaTypeCodeText,
            MapCode: data.mapcode_doc.MapCodeText,
            ResolutionCode: data.rescode,
            Year: Number(data.y),
            Month: Number(data.m),
            Day: Number(document._id.Day),
            DayAheadTotalLoadForecastByDayValue: document.total,
            ActualTotalLoadByDayValue: document.ForActualTotalLoad[0].total
        }
    },

    // for json format
    generateResponse_csv: async function (docs,path){

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
            {id: 'DayAheadTotalLoadForecastByDayValue', title: 'DayAheadTotalLoadForecastByDayValue'},
            {id: 'ActualTotalLoadByDayValue', title: 'ActualTotalLoadByDayValue'}
            
        
        ],
        fieldDelimiter: ';'
        });
        
        return csvWriter
        .writeRecords(docs);
        
        

    }
  };


