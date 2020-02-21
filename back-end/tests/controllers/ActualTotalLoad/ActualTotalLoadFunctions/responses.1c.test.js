const {generateResponse_json} = require('../../../../api/controllers/ActualTotalLoad/ActualTotalLoadFunctions/responses_1c');
const {generateResponse_csv} = require('../../../../api/controllers/ActualTotalLoad/ActualTotalLoadFunctions/responses_1c');

test('GET: https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/year/2018 -> response_1c', () => {
    // Arguments should have the following form
    // #################################################################################
    
    // The first document of sample data
    const document = { 
        "_id" : {
            "Year" : 2018, 
            "Month" : 1
        }, 
        "total" : 1308759.35, 
        "count" : 217.0
    }

    // data object should have the following form
    const data = {
        source: 'entso-e',
        dataset: 'ActualTotalLoad',
        areaname: 'Greece',
        areatypecodetext: "CTY",
        mapcodetext: "GR",
        rescode: "PT60M",
        y: "2018"
    };
    // #################################################################################

    // Response should be
    // #################################################################################
    const expected_1c_response = {
        Source: 'entso-e',
        Dataset: 'ActualTotalLoad',
        AreaName: 'Greece',
        AreaTypeCode: 'CTY',
        MapCode: 'GR',
        ResolutionCode: 'PT60M',
        Year: 2018,
        Month: 1,
        ActualTotalLoadByMonthValue: 1308759.35
      };
    
    const actual_response_json = generateResponse_json(data, document);
    expect(actual_response_json).toStrictEqual(expected_1c_response);
    // #################################################################################

});




test('GET: https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/year/2018?format=csv -> response_1c', async () =>{
    
    // Arguments should have the following form
    // #################################################################################
    
    // docs object should have the following form
    const docs = [
        {
            Source: 'entso-e',
            Dataset: 'ActualTotalLoad',
            AreaName: 'Greece',
            AreaTypeCode: 'CTY',
            MapCode: 'GR',
            ResolutionCode: 'PT60M',
            Year: 2018,
            Month: 1,
            ActualTotalLoadByMonthValue: 1308759.35
          },
          {
            Source: 'entso-e',
            Dataset: 'ActualTotalLoad',
            AreaName: 'Greece',
            AreaTypeCode: 'CTY',
            MapCode: 'GR',
            ResolutionCode: 'PT60M',
            Year: 2018,
            Month: 2,
            ActualTotalLoadByMonthValue: 1308759.35
          }
          
    ];
    // #################################################################################

    // Response should be
    // #################################################################################  
    // write a file using the same technique with our function
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
        path: './tests/files/ActualTotalLoad/ActualTotalLoad_1c_test_manually.csv',
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
            {id: 'ActualTotalLoadByMonthValue', title: 'ActualTotalLoadByMonthValue'},
        ],
        fieldDelimiter: ';'
    });
        
    
    
    // get the result promises from each method
    const expected_promise = await csvWriter.writeRecords(docs);
    const actual_promise = await generateResponse_csv(docs, './tests/files/ActualTotalLoad/ActualTotalLoad_1c_test_actual.csv');

    // check
    const fs = require('fs');
    expect(actual_promise).toBe(expected_promise);  // check if both are promises
    expect(fs.existsSync('./tests/files/ActualTotalLoad/ActualTotalLoad_1c_test_actual.csv')).toBe(true);   // check if our function created the file requested
    expect(fs.readFileSync('./tests/files/ActualTotalLoad/ActualTotalLoad_1c_test_actual.csv')).toStrictEqual(fs.readFileSync('./tests/files/ActualTotalLoad/ActualTotalLoad_1c_test_manually.csv'));   // check if contents are the same
    
    // #################################################################################


});
