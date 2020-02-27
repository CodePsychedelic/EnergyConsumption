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
        axios.put.mockReset();
        done();
    })
        
    // SUCCESS
    // ###################################################################################################################################
    // SUCCESSFUL ActualTotalLoad date
    // -----------------------------------------------------------------------------------------
    it('ActualTotalLoad - date - Should return a successful reply containing count and docs', async (done) => {
        
        let docs = {
            count: 24

        };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: docs 
            })
        );

        done();    
    });
    // -----------------------------------------------------------------------------------------

});