const {login} = require('../../Auth/AuthEndpoints');
const {logout} = require('../../Auth/AuthEndpoints');
const {setup} = require('./variables');
const messages = require('../../messages');

const fs = require('fs');
const qs = require('qs');

const axios = require('axios');
jest.mock('axios');

describe('Auth requests', () => {

    beforeAll(function(done){
        setup();
        done();
    });


    
    // SUCCESSFUL LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - should create a token for the user', async (done) => {
        
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

        let url = 'http://localhost:8765/energy/api/Login';
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8"}};
        let info = qs.stringify(cli);

        const data = await login(cli);
        console.log(data);
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);
        expect(data).toStrictEqual({token:"abcdef"});
        try{
            let fdata = fs.readFileSync(process.env.TOKEN);
            expect(fdata.toString()).toBe('abcdef');
        }catch(err){
            done(err);
        }

        done();    
    });
    // -----------------------------------------------------------------------------------------

    // LOGIN - SECOND REQUEST - UNSUCCESSFUL
    // -----------------------------------------------------------------------------------------
    it('Login - second login should fail, and inform the user for the token exp', async (done) => {
        
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

        let url = 'http://localhost:8765/energy/api/Login';
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};
        let info = qs.stringify(cli);

        const data = await login(cli);
        
        
        expect(axios.post).toHaveBeenCalledTimes(2);
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);
        expect(data).toBe('Token expires at: ' + new Date(exp * 1000));
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // LOGOUT REQUEST - SUCCESSFUL
    // -----------------------------------------------------------------------------------------
    it('Logout - should remove the token file', async (done) => {
        
        // setup - post request that returns an error on double login
        // ---------------------------------------------------------
        
        // setup - post request that returns an empty response body
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: {  }
            })
        );        

        // ---------------------------------------------------------
   

        let url = 'http://localhost:8765/energy/api/Logout';
        let headers = {"headers": {"x_observatory_auth": "abcdef"}};

        const data = await logout();
        
        
        expect(axios.post).toHaveBeenCalledTimes(3);
        expect(axios.post).toHaveBeenCalledWith(url, null, headers);
        expect(data).toStrictEqual({});

        try{
            fs.readFileSync(process.env.TOKEN);
            done('Token exists');   
        }catch(err){
            done();
        }

         
    });
    // -----------------------------------------------------------------------------------------

    // Wrong credentials
    // failed LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - should create an error message for wrong cred', async (done) => {
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
            passw:  '123'
        }

        const data = await login(cli);
        expect(axios.post).toHaveBeenCalledTimes(4);    // we do not expect a call on the post method for login
        expect(data).toStrictEqual(error.response.data);
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
    
    // MISSING username parameter
    // failed LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - should create an error message for missing username', async (done) => {
        
              
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
        expect(axios.post).toHaveBeenCalledTimes(4);    // we do not expect a call on the post method for login
        expect(data).toBe(messages.LOGIN_PARAMS);
        done();    
    });
    // -----------------------------------------------------------------------------------------

    // MISSING password parameter
    // failed LOGIN REQUEST
    // -----------------------------------------------------------------------------------------
    it('Login - should create an error message for missing username', async (done) => {
        
              
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
        expect(axios.post).toHaveBeenCalledTimes(4);    // we do not expect a call on the post method for login
        expect(data).toBe(messages.LOGIN_PARAMS);
        done();    
    });
    // -----------------------------------------------------------------------------------------


});