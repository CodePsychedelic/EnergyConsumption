const {load_query} = require('../../Data/Load');

const {setup} = require('./variables');
const messages = require('../../messages');

const fs = require('fs');
const qs = require('qs');

const axios = require('axios');
jest.mock('axios');

describe('Actual, DayAhead, ActualvsForecast tests', () => {

    beforeEach(function(done){
        setup();
        done();
    });

    afterEach(function(done){
        axios.get.mockReset();
        done();
    })
        
    // SUCCESS
    // ###################################################################################################################################
    // SUCCESSFUL ActualTotalLoad date PT60M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - DATE - PT60M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT60M',
            date: '2018-01-04',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL ActualTotalLoad DATE PT30M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - DATE - PT30M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT30M',
            date: '2018-01-04',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT30M/date/2018-01-04';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL ActualTotalLoad DATE PT15M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - DATE - PT15M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT15M',
            date: '2018-01-04',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT15M/date/2018-01-04';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // *********************************************************************************************************************************
    // SUCCESSFUL ActualTotalLoad MONTH PT60M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - MONTH - PT60M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT60M',
            month: '2018-01',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/month/2018-01';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------



    // SUCCESSFUL ActualTotalLoad MONTH PT30M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - MONTH - PT30M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT30M',
            month: '2018-01',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT30M/month/2018-01';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL ActualTotalLoad MONTH PT15M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - MONTH - PT15M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT15M',
            month: '2018-01',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT15M/month/2018-01';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // *********************************************************************************************************************************
        
    // SUCCESSFUL ActualTotalLoad YEAR PT60M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT60M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL ActualTotalLoad YEAR PT30M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT30M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT30M',
            year: '2018',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT30M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL ActualTotalLoad YEAR PT15M
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT15M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT15M',
            year: '2018',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT15M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL ActualTotalLoad YEAR PT60M, Austria
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - AUSTRIA - YEAR - PT60M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Austria'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Austria/PT60M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // SUCCESSFUL DayAheadTotalLoadForecast YEAR PT60M
    // -----------------------------------------------------------------------------------------
    it('DayAheadTotalLoadForecast - GREECE - YEAR - PT60M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'DayAheadTotalLoadForecast');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // SUCCESSFUL ActualvsForecast YEAR PT60M
    // -----------------------------------------------------------------------------------------
    it('ActualvsForecast - GREECE - YEAR - PT60M - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualvsForecast/Greece/PT60M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualvsForecast');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------



    // SUCCESSFUL ActualTotalLoad - FORMAT option
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT60M - FORMAT - Should do a request and return the response data', async (done) => {
        
        let docs = {
            count: 3,
            results: [{Load:1000},{Load:2000},{Load:3000}]
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );
        
        // args
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece',
            format: 'csv'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/year/2018?format=csv';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await load_query(cli, 'ActualTotalLoad');
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // ERROR RESPONSE
    // ###################################################################################################################################
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT60M - NO DATA - Should do a request and return the error response data', async (done) => {
        // error object for wrong credentials
        let error = {
            response:{
                    data:{
                        status: 403,
                        message: "No data"
                    }
                }
            };

        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject(error)
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece'
        }

        let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/year/2018';                                                 // url
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     

        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(error.response.data);                    // we do expect error response data for invalid credentials
        expect(axios.get).toHaveBeenCalledTimes(1);                        // we do expect a call
        expect(axios.get).toHaveBeenLastCalledWith(url, headers);    // with correct parameters
    
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // VALIDATIONS
    // ###################################################################################################################################
    // AUTH ERROR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT60M - AUTH ERROR - Should NOT do a request and should return the AUTH ERR messsage', async (done) => {

        process.env.TOKEN = './tests/Data/non_existent.token';

        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.AUTH_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            
    
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
    // FORMAT ERROR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT60M - BAD FORMAT ERROR - Should NOT do a request and should return the BAD FORMAT ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece',
            format: 'jpeg'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.FORMAT_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            
    
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // YEAR ERROR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - YEAR - PT60M - INVALID YEAR ERROR - Should NOT do a request and should return the INVALID YEAR ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            year: '20128',
            area: 'Greece',
            format: 'csv'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.YEAR_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    
    // MONTH ERROR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - MONTH - PT60M - INVALID MONTH ERROR - Should NOT do a request and should return the INVALID MONTH ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            month: '2018-01-',
            area: 'Greece',
            format: 'csv'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.MONTH_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------


    // DATE ERROR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - DATE - PT60M - INVALID DATE ERROR - Should NOT do a request and should return the INVALID DATE ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            date: '2018-01-044',
            area: 'Greece',
            format: 'csv'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.DATE_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // TIMERES ERROR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - DATE - PT40M - INVALID TIMERES - Should NOT do a request and should return the INVALID TIMERES ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT40M',
            date: '2018-01-04',
            area: 'Greece',
            format: 'csv'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.TIMERES_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // INVALID CHARACTERS ERR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE/INVALID - DATE - PT60M - INVALID CHARACTERS IN AREANAME - Should NOT do a request and should return the INVALID CHARACTERS ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            date: '2018-01-04',
            area: 'Greece/whatever'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.INVALID_CHARACTERS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // REQUIRED PARAMATERS - timeres missing
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - DATE - MISSING TIMERES - Should NOT do a request and should return the REQ PARAMETERS messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            date: '2018-01-04',
            area: 'Greece',
            format: 'csv'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.LOAD_REQ_ARGS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // REQUIRED PARAMATERS - area missing
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad  MISING AREANAME - DATE - PT60M - Should NOT do a request and should return the REQ PARAMETERS messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            date: '2018-01-04',
            timeres: 'PT60M',
            format: 'csv'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.LOAD_REQ_ARGS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // REQUIRED PARAMATERS - group missing
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad  GREECE - GROUPING MISSING - PT60M - Should NOT do a request and should return the REQ PARAMETERS messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            area: 'Greece',
            timeres: 'PT60M',
            format: 'csv'
        }

        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual(messages.LOAD_REQ_ARGS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // ###################################################################################################################################
    // SERVER OFF ERR
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - GREECE - DATE - PT60M - SERVER OFF - Should NOT do a request and should return the SERVER OFF error response', async (done) => {

        let error = {
            code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1' 
        };

        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject(error)
        );        


        // argument
        let cli = {
            timeres: 'PT60M',
            date: '2018-01-04',
            area: 'Greece'
        }


         // url and headers we expect
         let url = 'http://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04';                                                                   
         let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        
        const data = await load_query(cli,'ActualTotalLoad');

        expect(data).toStrictEqual({ code: error.code, no: error.errno, address: error.address});                    
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url,headers);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------



});