const {gen_query} = require('../../Data/AggregatedGenerationPerType');

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
    // SUCCESSFUL AggregatedGenerationPerType date PT60M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - DATE - PT60M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT60M/date/2018-01-04';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL AggregatedGenerationPerType date PT30M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - DATE - PT30M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT30M/date/2018-01-04';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL AggregatedGenerationPerType date PT15M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - DATE - PT15M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT15M/date/2018-01-04';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // *********************************************************************************************************************************
    // SUCCESSFUL AggregatedGenerationPerType MONTH PT60M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - MONTH - PT60M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT60M/month/2018-01';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------



    // SUCCESSFUL AggregatedGenerationPerType MONTH PT30M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - MONTH - PT30M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT30M/month/2018-01';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL AggregatedGenerationPerType MONTH PT15M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - MONTH - PT15M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT15M/month/2018-01';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // *********************************************************************************************************************************
        
    // SUCCESSFUL AggregatedGenerationPerType YEAR PT60M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - YEAR - PT60M - Should do a request and return the response data', async (done) => {
        
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
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT60M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL AggregatedGenerationPerType YEAR PT30M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - YEAR - SOLAR - PT30M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT30M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL AggregatedGenerationPerType YEAR PT15M
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - YEAR - PT15M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT15M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // SUCCESSFUL AggregatedGenerationPerType YEAR PT60M, Austria, AllTypes
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - AUSTRIA - AllTypes - YEAR - PT60M - Should do a request and return the response data', async (done) => {
        
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
            area: 'Austria',
            prodtype: 'AllTypes'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Austria/AllTypes/PT60M/year/2018';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
        expect(data).toStrictEqual(docs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url, headers);
        done();    
    });
    // -----------------------------------------------------------------------------------------


    
    // SUCCESSFUL AggregatedGenerationPerType - FORMAT option - AllTypes
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - AllTypes - YEAR - PT60M - FORMAT - Should do a request and return the response data', async (done) => {
        
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
            format: 'csv',
            prodtype: 'AllTypes'
        }

        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/AllTypes/PT60M/year/2018?format=csv';                                                                   
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        


        // call 
        const data = await gen_query(cli);
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
    it('AggregatedGenerationPerType - GREECE - SOLAR - YEAR - PT60M - NO DATA - Should do a request and return the error response data', async (done) => {
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
            area: 'Greece',
            prodtype: 'Solar'
        }

        let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT60M/year/2018';                                                 // url
        let headers = {"headers": {"x_observatory_auth": "dummy"}};     

        const data = await gen_query(cli);

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
    it('AggregatedGenerationPerType - GREECE - SOLAR - YEAR - PT60M - AUTH ERROR - Should NOT do a request and should return the AUTH ERR messsage', async (done) => {

        process.env.TOKEN = './tests/Data/non_existent.token';

        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.AUTH_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            
    
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
    // FORMAT ERROR
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - YEAR - SOLAR - PT60M - BAD FORMAT ERROR - Should NOT do a request and should return the BAD FORMAT ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            year: '2018',
            area: 'Greece',
            format: 'jpeg',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.FORMAT_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            
    
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // YEAR ERROR
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - YEAR - SOLAR - PT60M - INVALID YEAR ERROR - Should NOT do a request and should return the INVALID YEAR ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            year: '20128',
            area: 'Greece',
            format: 'csv',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.YEAR_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    
    // MONTH ERROR
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - MONTH - SOLAR - PT60M - INVALID MONTH ERROR - Should NOT do a request and should return the INVALID MONTH ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            month: '2018-01-',
            area: 'Greece',
            format: 'csv',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.MONTH_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------


    // DATE ERROR
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - DATE - PT60M - INVALID DATE ERROR - Should NOT do a request and should return the INVALID DATE ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            date: '2018-01-044',
            area: 'Greece',
            format: 'csv',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.DATE_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // TIMERES ERROR
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - DATE - PT40M - INVALID TIMERES - Should NOT do a request and should return the INVALID TIMERES ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT40M',
            date: '2018-01-04',
            area: 'Greece',
            format: 'csv',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.TIMERES_ERROR);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // INVALID CHARACTERS ERR - AREA
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE/INVALID - SOLAR - DATE - PT60M - INVALID CHARACTERS IN AREANAME - Should NOT do a request and should return the INVALID CHARACTERS ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            date: '2018-01-04',
            area: 'Greece/whatever',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.INVALID_CHARACTERS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // INVALID CHARACTERS ERR - prod
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE/INVALID - SOLAR - DATE - PT60M - INVALID CHARACTERS IN PRODTYPE - Should NOT do a request and should return the INVALID CHARACTERS ERR messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            timeres: 'PT60M',
            date: '2018-01-04',
            area: 'Greece',
            prodtype: 'Solar/url',
            
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.INVALID_CHARACTERS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------


    // REQUIRED PARAMATERS - timeres missing
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - DATE - MISSING TIMERES - Should NOT do a request and should return the REQ PARAMETERS messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            date: '2018-01-04',
            area: 'Greece',
            format: 'csv',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.AGGR_REQ_ARGS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // REQUIRED PARAMATERS - area missing
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - AREA MISSING - SOLAR - DATE - PT60M - Should NOT do a request and should return the REQ PARAMETERS messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            date: '2018-01-04',
            timeres: 'PT60M',
            format: 'csv',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.AGGR_REQ_ARGS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // REQUIRED PARAMATERS - group missing
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - GROUP MISSING - PT60M - Should NOT do a request and should return the REQ PARAMETERS messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            area: 'Greece',
            timeres: 'PT60M',
            format: 'csv',
            prodtype: 'Solar'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.AGGR_REQ_ARGS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // REQUIRED PARAMATERS - prodtype missing
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - PROD MISSING - DATE - PT60M - Should NOT do a request and should return the REQ PARAMETERS messsage', async (done) => {


        // setup - post request that returns an empty response body
        axios.get.mockImplementationOnce(() =>
            Promise.reject({})
        );        


        // argument
            
        let cli = {
            area: 'Greece',
            timeres: 'PT60M',
            date: '2018-01-04',
            format: 'csv'
        }

        
        const data = await gen_query(cli);

        expect(data).toStrictEqual(messages.AGGR_REQ_ARGS);                    
        expect(axios.get).toHaveBeenCalledTimes(0);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // ###################################################################################################################################
    // SERVER OFF ERR
    // -----------------------------------------------------------------------------------------
    it('AggregatedGenerationPerType - GREECE - SOLAR - DATE - PT60M - SERVER OFF - Should NOT do a request and should return the SERVER OFF error response', async (done) => {

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
            area: 'Greece',
            prodtype: 'Solar'
        }


         // url and headers we expect
         let url = 'http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/Solar/PT60M/date/2018-01-04';                                                                   
         let headers = {"headers": {"x_observatory_auth": "dummy"}};     
        
        const data = await gen_query(cli);

        expect(data).toStrictEqual({ code: error.code, no: error.errno, address: error.address});                    
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(url,headers);                            

        done();    
    });
    // -----------------------------------------------------------------------------------------



});