const {hcheck} = require('../../Help/HelpEndpoints');
     
let originalLog = null;
let outputData = "";


const axios = require('axios');
jest.mock('axios');

describe('HealthCheck request', () => {

    beforeEach(function(done){
        done();
    })

    afterEach(function(done){
        axios.get.mockReset();
        done();
    });

    
    it('HealthCheck - successful request', async (done) => {
        
        // setup - get request
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { status: "OK" }
            })
        );

        const data = await hcheck();
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8765/energy/api/HealthCheck/');
        expect(data).toStrictEqual({status:"OK"})

        done();    
    });


    it('HealthCheck - connection error', async (done) => {
        
        // setup - reject request
        let error = { code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1' }
        axios.get.mockImplementationOnce(() =>
            Promise.reject(error),
        );
        const data = await hcheck();
        expect(data).toStrictEqual({code: error.code, no: error.errno, address: error.address});
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8765/energy/api/HealthCheck/');
        done();    
    });


});