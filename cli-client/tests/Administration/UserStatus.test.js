const {user_status} = require('../../Administration/UserStatus');

const {setup} = require('./variables');
const messages = require('../../messages');

const fs = require('fs');
const qs = require('qs');

const axios = require('axios');
jest.mock('axios');

describe('Admin requests', () => {

    beforeEach(function(done){
        setup();
        done();
    });

    afterEach(function(done){
        axios.get.mockReset();
        done();
    })
        
    
    // SUCCESS
    // ##############################################################################################################################
    // SUCCESSFUL USERSTATUS
    // -----------------------------------------------------------------------------------------
    it('User status - Existing User reply - It should do a successful request and get user status', async (done) => {
        
        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { username: "user", email: "user@gmail.com", quota: 5, role: 'USER' }
            })
        );

        // argument
        let cli = {
            userstatus: 'user'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/user';
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};

        const data = await user_status(cli);                                                                // call
        expect(data).toStrictEqual({username: "user", email: "user@gmail.com", quota: 5, role: 'USER'});    // data should be the user status
        expect(axios.get).toHaveBeenCalledTimes(1);                                                         // shoud do the request
        expect(axios.get).toHaveBeenCalledWith(url, headers);                                               // must be called with correct url and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ##############################################################################################################################

    // ERROR RESPONSE
    // ##############################################################################################################################
    // NON EXISTING USER STATUS
    // -----------------------------------------------------------------------------------------
    it('User status - Non Existing reply - Should perform the request, and return the error response', async (done) => {
        
        let error = {
            response:{
                data:{
                    message: 'Bad request', 
                    code: 400, 
                    additional: 'User not found' 
                }
            }
        }
            
        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.reject(error)
        );


        // argument
        let cli = {
            userstatus: 'user_non_existent'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/user_non_existent'; 
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};

        const data = await user_status(cli);                    // call
        expect(data).toStrictEqual(error.response.data);        // we are expecting the error
        expect(axios.get).toHaveBeenCalledTimes(1);             // request should be made
        expect(axios.get).toHaveBeenCalledWith(url, headers);   // must be called with correct url and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    

    // INVALID TOKEN
    // -----------------------------------------------------------------------------------------
    it('User status - Invalid token - Should perform the request, and return the error response', async (done) => {
        
        let error = {
            response:{
                data:{
                    message: 'Not authorized',
                    code: 401,
                    additional: 'You do not have a valid token'
                }
            }
        }
            
        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.reject(error)
        );


        // argument
        let cli = {
            userstatus: 'user'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/user'; 
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};

        const data = await user_status(cli);                    // call
        expect(data).toStrictEqual(error.response.data);        // we are expecting the error
        expect(axios.get).toHaveBeenCalledTimes(1);             // request should be made
        expect(axios.get).toHaveBeenCalledWith(url, headers);   // must be called with correct url and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ##############################################################################################################################

    // VALIDATION
    // ##############################################################################################################################
    // Non existing token
    // -----------------------------------------------------------------------------------------
    it('User status - Non existing token - Should not make the request, and should inform', async (done) => {
        process.env.TOKEN = './tests/Administration/non_existing.token';    // alter token - path non existing
        
        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({})
        );


     
        // argument
        let cli = {
            userstatus: 'user'
        }
        

        const data = await user_status(cli);                    // call
        expect(data).toStrictEqual(messages.AUTH_ERROR);        // we are expecting the error
        expect(axios.get).toHaveBeenCalledTimes(0);             // request should not happen

        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ##############################################################################################################################

    
    // Server off - connection error
    // ##############################################################################################################################
    // -----------------------------------------------------------------------------------------
    it('User status - Server off/Connection err - Should not make the request, and should inform', async (done) => {
        let error = {
            code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1' 
        };

        // setup - get
        axios.get.mockImplementationOnce(() =>
            Promise.reject(error)
        );
        

        // argument
        let cli = {
            userstatus: 'user'
        }
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/user'; 
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};


        const data = await user_status(cli);                    // call
        console.log(data);
        expect(data).toStrictEqual({ code: error.code, no: error.errno, address: error.address});        // we are expecting the error
        expect(axios.get).toHaveBeenCalledTimes(1);             // request should be made
        expect(axios.get).toHaveBeenCalledWith(url, headers);   // must be called with correct url and headers

        done();    
    });
    // -----------------------------------------------------------------------------------------


});