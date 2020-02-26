const {login} = require('../../Auth/AuthEndpoints');
const {logout} = require('../../Auth/AuthEndpoints');
const {setup} = require('./variables');
const messages = require('../../messages');

const fs = require('fs');
const qs = require('qs');

const axios = require('axios');
jest.mock('axios');

describe('Auth requests', () => {

    beforeEach(function(done){
        setup();
        done();
    });


    
    afterEach(async function(done){
        axios.post.mockReset();
        try{
            fs.unlinkSync('./tests/Auth/softeng19bAPI.token');
        }catch(err){}

        done();
    })

    // SUCCESSFUL responses
    // ###################################################################################################
    // SUCCESSFUL LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - no token - should create request and return the response data and create token file', async (done) => {
        
        // setup - post request that returns a token on success
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: { token: "abcdef" }
            })
        );

        // argument
        let cli = {
            username: 'user',
            passw:  '123'
        }

        let url = 'http://localhost:8765/energy/api/Login';                                                 // url to post
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8"}};     // non existent token
        let info = qs.stringify(cli);                                                                       // append user info

        const data = await login(cli);                                                                      // login
        expect(data).toStrictEqual({token:"abcdef"});                                                       // expect token to be retrieved
        expect(axios.post).toHaveBeenCalledTimes(1);                                                        // expect request to be mad
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);                                        // with correct parameters
        try{
            // token file should be created, with correct token inside
            let fdata = fs.readFileSync(process.env.TOKEN);
            expect(fdata.toString()).toBe('abcdef');
        }catch(err){
            done(err);
        }

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // LOGOUT REQUEST - SUCCESSFUL
    // -----------------------------------------------------------------------------------------
    it('Logout - valid token - should create request and remove the token file', async (done) => {
        
        // setup - post request that returns an error on double login
        // ---------------------------------------------------------
        
        // setup - post request that returns an empty response body
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {  }
            })
        );        

        // ---------------------------------------------------------
   
        fs.writeFileSync(process.env.TOKEN, 'abcdef');
        
        let url = 'http://localhost:8765/energy/api/Logout';            // url
        let headers = {"headers": {"x_observatory_auth": "abcdef"}};    // should have the token @ headers
        
        const data = await logout();
        
        expect(data).toStrictEqual({});                                 // we expect empty response body
        expect(axios.post).toHaveBeenCalledTimes(1);                    // we expect a call
        expect(axios.post).toHaveBeenCalledWith(url, null, headers);    // with correct parameters
        

        try{
            // we expect token file to be removed
            fs.readFileSync(process.env.TOKEN);
            done('Token exists');   
        }catch(err){
            done();
        }

         
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################
    
    // ERROR RESPONSE
    // ###################################################################################################
    // Wrong credentials
    // failed LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - wrong credentials - should create request and  return error response data', async (done) => {
        // error object for wrong credentials
        let error = {
            response:{
                    data:{
                        status: 401,
                        message: "Not authorized",
                        additional: "Username or password error" 
                    }
                }
            };

        // setup - post request that returns an empty response body
        axios.post.mockImplementationOnce(() =>
            Promise.reject(error)
        );        


        // argument
        let cli = {
            username: 'user',
            passw:  '12'
        }

        let url = 'http://localhost:8765/energy/api/Login';                                                 // url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8"}};     // no token
        let info = qs.stringify(cli);                                                                       // data

    

        const data = await login(cli);

        expect(data).toStrictEqual(error.response.data);                    // we do expect error response data for invalid credentials
        expect(axios.post).toHaveBeenCalledTimes(1);                        // we do expect a call
        expect(axios.post).toHaveBeenLastCalledWith(url, info, headers);    // with correct parameters
    
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // Logout - blacklisted token
    // failed LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Logout - blacklisted token - should create request and return error response data', async (done) => {
        process.env.TOKEN = './tests/Auth/invalid.token';
        // error object for wrong credentials
        let error = {
            response:{
                    data:{
                        status: 401,
                        message: "Not authorized",
                        additional: "You do not have a valid token" 
                    }
                }
            };

        // setup - post request that returns an empty response body
        axios.post.mockImplementationOnce(() =>
            Promise.reject(error)
        );        



        let url = 'http://localhost:8765/energy/api/Logout';                                                 // url
        let headers = {"headers": {"x_observatory_auth": "invalid"}};     
        
        const data = await logout();

        expect(data).toStrictEqual(error.response.data);                    // we do expect error response data 
        expect(axios.post).toHaveBeenCalledTimes(1);                        // we do expect a call
        expect(axios.post).toHaveBeenLastCalledWith(url, null, headers);    // with correct parameters
    
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // ###################################################################################################

    // Validation Errors
    // ###################################################################################################
    // LOGIN - SECOND REQUEST - UNSUCCESSFUL (special case)
    // -----------------------------------------------------------------------------------------
    it('Login - valid token login - should create request, fail and inform the user for the token exp time', async (done) => {
        process.env.TOKEN = './tests/Auth/valid.token';
        // setup - post request that returns an error on double login
        // ---------------------------------------------------------
        let date = new Date();
        let iat = Math.round(date/1000);
        
        date.setHours(date.getHours() + 1);
        let exp = Math.round(date/1000);
        

        let errorMessage =  {
            response:{
                    data:{
                    status: 400,
                    message: 'Bad request',
                    additional: {
                        message: 'You already have a valid token',
                        verified: {
                            username: 'user',
                            email: 'user@gmail.com',
                            role: 'USER',
                            iat: iat,
                            exp: exp
                        }
                    }
                }
            }
        };
        axios.post.mockImplementationOnce(() =>
            Promise.reject(errorMessage)
        );
        // ---------------------------------------------------------
        // argument
        let cli = {
            username: 'user',
            passw:  '123'
        }

        let url = 'http://localhost:8765/energy/api/Login';                                                                                 // url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "valid"}};     // should contain the valid token
        let info = qs.stringify(cli);                                                                                                       // user info

        const data = await login(cli);                                                                                                      // login
        
        expect(data).toBe('Token expires at: ' + new Date(exp * 1000));                                                                     // expect expire information
        expect(axios.post).toHaveBeenCalledTimes(1);                                                                                        // expect a call
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);                                                                        // with correct parameters
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // MISSING username parameter
    // failed LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - missing username - should not do request and should return LOGIN PARAMS message', async (done) => {
        
              
        // setup - post request that returns an empty response body
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {  }
            })
        );     

        // argument
        let cli = {
            passw:  '123'
        }

        const data = await login(cli);
        expect(data).toBe(messages.LOGIN_PARAMS);
        expect(axios.post).toHaveBeenCalledTimes(0);    // we do not expect a call on the post method for login

        await axios.post();                             // clear -> 5 calls

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // MISSING password parameter
    // failed LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - missing password - should not do request and should return LOGIN PARAMS message', async (done) => {
        
              
        // setup - post request that returns an empty response body
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {  }
            })
        );     

        // argument
        let cli = {
            username:  'user'
        }

        
        const data = await login(cli);
        expect(data).toBe(messages.LOGIN_PARAMS);       
        expect(axios.post).toHaveBeenCalledTimes(0);    // we do not expect a call on the post method for login
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // Non existent token
    // -----------------------------------------------------------------------------------------
    it('Logout - non existent token - should not do request and should return NO TOKEN ERR message', async (done) => {
        process.env.TOKEN = '/tests/Auth/non_existent.token';
              
        // setup - post request that returns an empty response body
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {  }
            })
        );     

        
        const data = await logout();
        expect(data).toBe(messages.NO_TOKEN_FOUND);       
        expect(axios.post).toHaveBeenCalledTimes(0);    // we do not expect a call on the post method for login
        
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // ###################################################################################################
    // SERVER OFF
    
    
     // -----------------------------------------------------------------------------------------
     it('Login - server off - return server off error', async (done) => {
        
        // setup - post request that returns an error on double login
        // ---------------------------------------------------------
        let error = { code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1' }
        axios.post.mockImplementationOnce(() =>
            Promise.reject(error)
        );
        // ---------------------------------------------------------
        
        // argument
        let cli = {
            username: 'user',
            passw:  '123'
        }

        let url = 'http://localhost:8765/energy/api/Login';                                                                                 // url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8"}};     
        let info = qs.stringify(cli);                                                                                                       // user info

        const data = await login(cli);                                                                                                      // login
        
        expect(data).toStrictEqual({code: error.code, no: error.errno, address: error.address});                                                                    
        expect(axios.post).toHaveBeenCalledTimes(1);                                                                                        // expect a call
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);                                                                        // with correct parameters
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
    
    
    
    // Logout
    // -----------------------------------------------------------------------------------------
    it('Logout - server off - should do request and should return SERVER OFF error', async (done) => {
        process.env.TOKEN = './tests/Auth/valid.token';
              
        // setup - post request that returns an error on double login
        // ---------------------------------------------------------
        let error = { code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1' }
        axios.post.mockImplementationOnce(() =>
            Promise.reject(error)
        );
        // ---------------------------------------------------------

        
        const data = await logout();
        expect(data).toStrictEqual({code: error.code, no: error.errno, address: error.address});       
        expect(axios.post).toHaveBeenCalledTimes(1);    // we do not expect a call on the post method for login
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

});