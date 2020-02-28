const {upload} = require('../../Administration/Upload');

const {setup} = require('./variables');
const messages = require('../../messages');

const fs = require('fs');
const qs = require('qs');
const FormData = require('form-data');

const axios = require('axios');
jest.mock('axios');

describe('Admin requests', () => {

    beforeEach(function(done){
        setup();
        done();
    });

    afterEach(function(done){
        axios.post.mockReset();
        done();
    })
        
    
    // SUCCESS
    // ###################################################################################################################################
    // SUCCESSFUL NEWDATA - ACTUALTOTALLOAD
    // -----------------------------------------------------------------------------------------
    it('newdata - successful upload and insertion - ActualTotalLoad - should do a request and return the response data', async (done) => {
        
        // setup
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {
                    totalRecordsInFile: 10,
                    totalRecordsImported: 10,
                    totalRecordsInDatabase: 25
                }
            })
        );

        // argument
        let cli = {
            newdata: 'ActualTotalLoad',
            source: 'file.csv'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/ActualTotalLoad';                                                                        
        
        // call
        const data = await upload(cli);                                                     
        
        
        // recreate headers
        // get the second arg of first (and only) call
        let arg1 = axios.post.mock.calls[0][1];     // should be the form data
        expect(arg1).toHaveProperty('_boundary');   // and we expect a boundary for the file
        let headers = arg1.getHeaders();            // get the form-data headers (with boundary)
        headers.x_observatory_auth = 'abcdef';      // and append the token - headers should have multipart; boundary and token


        // check response
        expect(data).toStrictEqual({
            totalRecordsInFile: 10,
            totalRecordsImported: 10,
            totalRecordsInDatabase: 25
        });                                                                                 
        
        
        // check the request calls and args
        expect(axios.post).toBeCalledTimes(1);
        expect(axios.post).toBeCalledWith(url, arg1, {headers:headers, maxContentLength: Infinity, maxBodyLength: Infinity});
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL NEWDATA - DayAheadTotalLoadForecast
    // -----------------------------------------------------------------------------------------
    it('newdata - successful upload and insertion - DayAheadTotalLoadForecast - should do a request and return the response data', async (done) => {
        
        // setup
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {
                    totalRecordsInFile: 10,
                    totalRecordsImported: 10,
                    totalRecordsInDatabase: 25
                }
            })
        );

        // argument
        let cli = {
            newdata: 'DayAheadTotalLoadForecast',
            source: 'file.csv'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/DayAheadTotalLoadForecast';                                                                        
        
        // call
        const data = await upload(cli);                                                     
        
        
        // recreate headers
        // get the second arg of first (and only) call
        let arg1 = axios.post.mock.calls[0][1];     // should be the form data
        expect(arg1).toHaveProperty('_boundary');   // and we expect a boundary for the file
        let headers = arg1.getHeaders();            // get the form-data headers (with boundary)
        headers.x_observatory_auth = 'abcdef';      // and append the token - headers should have multipart; boundary and token


        // check response
        expect(data).toStrictEqual({
            totalRecordsInFile: 10,
            totalRecordsImported: 10,
            totalRecordsInDatabase: 25
        });                                                                                 
        
        
        // check the request calls and args
        expect(axios.post).toBeCalledTimes(1);
        expect(axios.post).toBeCalledWith(url, arg1, {headers:headers, maxContentLength: Infinity, maxBodyLength: Infinity});
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    
    // SUCCESSFUL NEWDATA - AggregatedGenerationPerType
    // -----------------------------------------------------------------------------------------
    it('newdata - successful upload and insertion - AggregatedGenerationPerType - should do a request and return the response data', async (done) => {
        
        // setup
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {
                    totalRecordsInFile: 10,
                    totalRecordsImported: 10,
                    totalRecordsInDatabase: 25
                }
            })
        );

        // argument
        let cli = {
            newdata: 'AggregatedGenerationPerType',
            source: 'file.csv'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/AggregatedGenerationPerType';                                                                        
        
        // call
        const data = await upload(cli);                                                     
        
        
        // recreate headers
        // get the second arg of first (and only) call
        let arg1 = axios.post.mock.calls[0][1];     // should be the form data
        expect(arg1).toHaveProperty('_boundary');   // and we expect a boundary for the file
        let headers = arg1.getHeaders();            // get the form-data headers (with boundary)
        headers.x_observatory_auth = 'abcdef';      // and append the token - headers should have multipart; boundary and token


        // check response
        expect(data).toStrictEqual({
            totalRecordsInFile: 10,
            totalRecordsImported: 10,
            totalRecordsInDatabase: 25
        });                                                                                 
        
        
        // check the request calls and args
        expect(axios.post).toBeCalledTimes(1);
        expect(axios.post).toBeCalledWith(url, arg1, {headers:headers, maxContentLength: Infinity, maxBodyLength: Infinity});
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // ERROR RESPONSE
    // ###################################################################################################################################
    // BAD FILE 
    // -----------------------------------------------------------------------------------------
    it('newdata - successful upload, non successful insertion - ActualTotalLoad - should do a request and return the response error data', async (done) => {
        
        let error = {
            response:{
                data:{
                    message: 'Bad request', 
                    code: 400, 
                    additional: {
                        totalRecordsInFile: 10,
                        totalRecordsImported: 5,
                        totalRecordsInDatabase: 105,
                        message: "The insertion was not completed successfully. There was something wrong with the file uploaded",
                        info: 'A database information msg'
                    } 
                }
            }
        }
        // setup
        axios.post.mockImplementationOnce(() =>
            Promise.reject(error)
        );

        // argument
        let cli = {
            newdata: 'ActualTotalLoad',
            source: 'file.csv'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/ActualTotalLoad';                                                                        
        
        // call
        const data = await upload(cli);                                                     
        
        
        // recreate headers
        // get the second arg of first (and only) call
        let arg1 = axios.post.mock.calls[0][1];     // should be the form data
        expect(arg1).toHaveProperty('_boundary');   // and we expect a boundary for the file
        let headers = arg1.getHeaders();            // get the form-data headers (with boundary)
        headers.x_observatory_auth = 'abcdef';      // and append the token - headers should have multipart; boundary and token


        // check response
        expect(data).toStrictEqual(error.response.data);                                                                                 
        
        
        // check the request calls and args
        expect(axios.post).toBeCalledTimes(1);
        expect(axios.post).toBeCalledWith(url, arg1, {headers:headers, maxContentLength: Infinity, maxBodyLength: Infinity});
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // Validation Errors
    // ###################################################################################################################################

    // NO TOKEN CALL    
    // -----------------------------------------------------------------------------------------
    it('newdata - unsuccessful upload - ActualTotalLoad - NO TOKEN - should NOT do a request and return the AUTH error msg', async (done) => {
        process.env.TOKEN = './tests/Administration/non_existent.token';

        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newdata: 'ActualTotalLoad',
            source: 'file.csv'
        }
        
        
        const data = await upload(cli);                                                                // call
        expect(data).toStrictEqual(messages.AUTH_ERROR);                                                 // data should be the AUTH ERR msg
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // NO CSV FILE FOUND    
    // -----------------------------------------------------------------------------------------
    it('newdata - unsuccessful upload - ActualTotalLoad - NON EXISTENT CSV FILE - should NOT do a request and return the FILE NOT FOUND error msg', async (done) => {

        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newdata: 'ActualTotalLoad',
            source: 'file2.csv' // NON EXISTENT
        }
        
        
        const data = await upload(cli);                                                                // call
        expect(data).toStrictEqual(messages.FILE_NOT_FOUND);                                                 // data should be the FILE NOT FOUND ERR msg
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // BAD FILE - FILE IS NOT CSV    
    // -----------------------------------------------------------------------------------------
    it('newdata - unsuccessful upload - ActualTotalLoad - NON CSV FILE - should NOT do a request and return the SOURCE ERROR msg', async (done) => {

        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newdata: 'ActualTotalLoad',
            source: 'file2.jpg' 
        }
        
        
        const data = await upload(cli);                                                                // call
        expect(data).toStrictEqual(messages.SOURCE_ERROR);                                                 // data should be the SOURCE ERR msg
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------


    
    // WRONG DATASET SELECTED
    // -----------------------------------------------------------------------------------------
    it('newdata - unsuccessful upload - INVALID DATASET - should NOT do a request and return the NEW_DATA_ERROR msg', async (done) => {

        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newdata: 'ActualTotalLoad2',
            source: 'file2.jpg' 
        }
        
        
        const data = await upload(cli);                                                                // call
        expect(data).toStrictEqual(messages.NEW_DATA_ERROR);                                                 // data should be the NEW_DATA_ERROR msg
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // SERVER OFF error
    // ###################################################################################################################################
    // WRONG DATASET SELECTED
    // -----------------------------------------------------------------------------------------
    it('newdata - unsuccessful upload - SERVER OFF - should do a request and return the SERVER OFF msg', async (done) => {
        let error = {code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1'};
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                error
            )
        );

        // argument
        let cli = {
            newdata: 'ActualTotalLoad',
            source: 'file.csv' 
        }
        
        
        const data = await upload(cli);                                                                // call
        expect(data).toStrictEqual({ code: error.code, no: error.errno, address: error.address});      // data should be the no conn response
        expect(axios.post).toHaveBeenCalledTimes(1);                                                     // should do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
});