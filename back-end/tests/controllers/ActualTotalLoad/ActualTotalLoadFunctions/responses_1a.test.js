const {generateResponse_json} = require('../../../../api/controllers/ActualTotalLoad/ActualTotalLoadFunctions/responses_1a');
const {generateResponse_csv} = require('../../../../api/controllers/ActualTotalLoad/ActualTotalLoadFunctions/responses_1a');

test('GET: https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04 -> response_1a', () => {

    // Arguments should have the following form
    // #################################################################################
    
    // The first document of sample data
    const document ={
        "DateTime" : '2018-01-03T22:00:00.000Z', 
        "UpdateTime" : '2018-09-04T08:31:06.000Z', 
        "TotalLoadValue" : 4788.8
    };

    // data object should have the following form
    const data = {
        source: 'entso-e',
        dataset: 'ActualTotalLoad',
        areaname: 'Greece',
        areatypecodetext: 'CTY',
        mapcodetext: 'GR',
        rescode: 'PT60M',
        y: '2018',
        m: '01',
        d: '04'
    };
    // #################################################################################

    // Response should be
    // #################################################################################
    const expected_1a_response ={
        Source: 'entso-e',
        Dataset: 'ActualTotalLoad',
        AreaName: 'Greece',
        AreaTypeCode: 'CTY',
        MapCode: 'GR',
        ResolutionCode: 'PT60M',
        Year: 2018,
        Month: 1,
        Day: 4,
        DateTimeUTC: '2018-01-03T22:00:00.000Z',
        ActualTotalLoadValue: 4788.8,
        UpdateTimeUTC: '2018-09-04T08:31:06.000Z'
    };
    
    const actual_response_json = generateResponse_json(data, document);
    expect(actual_response_json).toStrictEqual(expected_1a_response);
    // #################################################################################

});




test('GET: https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?format=csv -> response_1a', async () =>{
    
    // Arguments should have the following form
    // #################################################################################
    
    // docs object should have the following form
    const docs = 
        [
            {
              Source: 'entso-e',
              Dataset: 'ActualTotalLoad',
              AreaName: 'Greece',        
              AreaTypeCode: 'CTY',       
              MapCode: 'GR',
              ResolutionCode: 'PT60M',   
              Year: 2018,
              Month: 1,
              Day: 4,
              DateTimeUTC: '2018-01-03T22:00:00.000Z',
              ActualTotalLoadValue: 4788.8,
              UpdateTimeUTC: '2018-09-04T08:31:06.000Z'
            },
            {
              Source: 'entso-e',
              Dataset: 'ActualTotalLoad',
              AreaName: 'Greece',
              AreaTypeCode: 'CTY',
              MapCode: 'GR',
              ResolutionCode: 'PT60M',
              Year: 2018,
              Month: 1,
              Day: 4,
              DateTimeUTC: '2018-01-03T23:00:00.000Z',
              ActualTotalLoadValue: 4660.11,
              UpdateTimeUTC: '2018-09-04T08:16:40.000Z'
            },
            {
              Source: 'entso-e',
              Dataset: 'ActualTotalLoad',
              AreaName: 'Greece',
              AreaTypeCode: 'CTY',
              MapCode: 'GR',
              ResolutionCode: 'PT60M',
              Year: 2018,
              Month: 1,
              Day: 4,
              DateTimeUTC: '2018-01-04T00:00:00.000Z',
              ActualTotalLoadValue: 4573.84,
              UpdateTimeUTC: '2018-09-04T08:31:06.000Z'
            }
    ];
    // #################################################################################

    // Response should be
    // #################################################################################
    
    // write a file using the same technique with our function
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
        path: "./tests/files/ActualTotalLoad/ActualTotalLoad_1a_test_manually.csv",
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

    // get the result promises from each method
    const expected_promise = await csvWriter.writeRecords(docs);
    const actual_promise = await generateResponse_csv(docs, './tests/files/ActualTotalLoad/ActualTotalLoad_1a_test_actual.csv');

    // check
    const fs = require('fs');
    expect(actual_promise).toBe(expected_promise);  // check if both are promises
    expect(fs.existsSync('./tests/files/ActualTotalLoad/ActualTotalLoad_1a_test_actual.csv')).toBe(true);   // check if our function created the file requested
    expect(fs.readFileSync('./tests/files/ActualTotalLoad/ActualTotalLoad_1a_test_actual.csv')).toStrictEqual(fs.readFileSync('./tests/files/ActualTotalLoad/ActualTotalLoad_1a_test_manually.csv'));   // check if contents are the same
    
    // #################################################################################


});
