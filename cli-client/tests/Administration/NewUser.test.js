const {new_user} = require('../../Administration/NewUser');

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
        axios.post.mockReset();
        done();
    })
        
    
    // SUCCESS
    // ###################################################################################################################################
    // SUCCESSFUL NEWUSER 
    // -----------------------------------------------------------------------------------------
    it('newuser - Successful Creation - Should return a successful reply containing username', async (done) => {
        
        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: { username: "User1"}
            })
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            quota: 40,
            email: 'user1@gmail.com'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users';                                                                           // post url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        let info = qs.stringify({                                                                                                           // data we must post
            username: 'User1',
            passwd: '123',
            email: 'user1@gmail.com',
            quota: 40,
        });
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual({username: "User1"});                                                 // data should be the username
        expect(axios.post).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################
    
    // ERROR RESPONSE
    // EXISTING NEW USER 
    // ###################################################################################################################################
    // -----------------------------------------------------------------------------------------
    it('newuser - Existing User - Should return an error response', async (done) => {
        let error = {
            response:{
                data: { 
                    message: 'Bad request',
                    code: 400,
                    additional: 'User specified by info provided already exists'    
                }
            }    
        }

        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                error
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            quota: 40,
            email: 'user1@gmail.com'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users';                                                                           // post url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        let info = qs.stringify({                                                                                                           // data we must post
            username: 'User1',
            passwd: '123',
            email: 'user1@gmail.com',
            quota: 40,
        });
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual({ message: 'Bad request', code: 400, additional: 'User specified by info provided already exists'  });  // data should be the error (response)
        expect(axios.post).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // VALIDATIONS
    // ###################################################################################################################################
    // NO TOKEN CALL    
    // -----------------------------------------------------------------------------------------
    it('newuser - No token - Should return an auth error msg, without request', async (done) => {
        process.env.TOKEN = './tests/Administration/non_existent.token';

        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            quota: 40,
            email: 'user1@gmail.com'
        }
        
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.AUTH_ERROR);                                                 // data should be the AUTH ERR msg
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------




    
    // INVALID EMAIL INPUT
    // -----------------------------------------------------------------------------------------
    it('newuser - Invalid email - Should return an email error msg without call', async (done) => {
    
        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            quota: 40,
            email: 'user1gmail.com'
        }
        
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.EMAIL_ERROR);                                                 // data should be the EMAIL ERROR
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
    
    // NON NUMERIC QUOTA CALL
    // -----------------------------------------------------------------------------------------
    it('newuser - Invalid quota - Should return an quota error msg without call', async (done) => {
    
        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            quota: 'A23',
            email: 'user1@gmail.com'
        }
        
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.QUOTA_ERROR);                                                 // data should be the QUOTA ERROR
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // PASSWD LEN ERROR
    // -----------------------------------------------------------------------------------------
    it('newuser - Invalid passwd - Should return an passwd error msg without call', async (done) => {
    
        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '12',
            quota: 40,
            email: 'user1@gmail.com'
        }
        
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.PASSWD_ERROR);                                                 // data should be the QUOTA ERROR
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------



    // REQUIRED PARAMETER MISSING (email)
    // -----------------------------------------------------------------------------------------
    it('newuser - email missing - Should return parameters error msg without call', async (done) => {
    
        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            quota: 40,
        }
        
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.NEW_USER_PARAMS);                                            // data should be the QUOTA ERROR
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    
    // REQUIRED PARAMETER MISSING (quota)
    // -----------------------------------------------------------------------------------------
    it('newuser - quota missing - Should return parameters error msg without call', async (done) => {
    
        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            email: 'user1@gmail.com'
        }
        
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.NEW_USER_PARAMS);                                            // data should be the QUOTA ERROR
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // REQUIRED PARAMETER MISSING (passw)
    // -----------------------------------------------------------------------------------------
    it('newuser - passw missing - Should return parameters error msg without call', async (done) => {
    
        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            quota: 40,
            email: 'user1@gmail.com'
        }
        
        
        const data = await new_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.NEW_USER_PARAMS);                                            // data should be the QUOTA ERROR
        expect(axios.post).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // SERVER OFF
    // ###################################################################################################################################
    // -----------------------------------------------------------------------------------------
    it('newuser - server off error msg', async (done) => {
        let error = {
            code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1' 
        };

        // setup - get
        axios.post.mockImplementationOnce(() =>
            Promise.reject( 
                error
            )
        );

        // argument
        let cli = {
            newuser: 'User1',
            passw: '123',
            email: 'user1@gmail.com',
            quota: 1000
        }
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        let info = qs.stringify({                                                                                                           // data we must put
            username: 'User1',
            passwd: '123',
            email: 'user1@gmail.com',
            quota: 1000
        });

        const data = await new_user(cli);                    // call
        expect(data).toStrictEqual({ code: error.code, no: error.errno, address: error.address});        // we are expecting the error
        expect(axios.post).toHaveBeenCalledTimes(1);             // request should be made
        expect(axios.post).toHaveBeenCalledWith(url, info, headers);   // must be called with correct url and headers

        done();    
    });
    // -----------------------------------------------------------------------------------------


});