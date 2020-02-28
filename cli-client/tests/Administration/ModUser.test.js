const {mod_user} = require('../../Administration/ModUser');

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
        axios.put.mockReset();
        done();
    })
        
    // SUCCESS
    // ALL COMPS FOR SUCCESSFUL MOD REQUEST
    // ###################################################################################################################################
    // SUCCESSFUL moduser (email)
    // -----------------------------------------------------------------------------------------
    it('moduser - Successful Mod (email only) - Should return a successful reply containing result doc', async (done) => {
        
        let doc = {
            quota: 10,
            quota_limit: 10,
            last_refresh: '2020-02-25T10:05:48.000Z',
            role: 'USER',
            _id: '5e550f5df06e503794a5f10e',
            username: 'user',
            passwd: '$2a$10$3JsK8EEd./TQcorHMJ5JP.uYqEO20Xoz3HqdCUtp8M4K3ndCYeZdS',
            email: 'updated@gmail.com',
            __v: 0
          };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: doc 
            })
        );

        // argument - mod email only
        let cli = {
            moduser: 'User1',
            email: 'updated@gmail.com'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        
        // updateOps should be
        let info = qs.stringify({                                                                                                           // data we must put
            email: 'updated@gmail.com'
        });
        
        const data = await mod_user(cli);                                                               // call
        expect(data).toStrictEqual(doc);                                                                // data
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // SUCCESSFUL moduser (passwd)
    // -----------------------------------------------------------------------------------------
    it('moduser - Successful Mod (passwd only) - Should return a successful reply containing result doc', async (done) => {
        
        let doc = {
            quota: 10,
            quota_limit: 10,
            last_refresh: '2020-02-25T10:05:48.000Z',
            role: 'USER',
            _id: '5e550f5df06e503794a5f10e',
            username: 'user',
            passwd: '$2a$10$3JsK8EEd./TQcorHMJ5JP.uYqEO20Xoz3HqdCUtp8M4K3ndCYeZdS',
            email: 'user@gmail.com',
            __v: 0
          };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: doc 
            })
        );

        // argument - mod passwd only
        let cli = {
            moduser: 'User1',
            passw: 'newpass'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        
        // updateOps should be
        let info = qs.stringify({                                                                                                           // data we must put
            passwd: 'newpass'
        });
        
        const data = await mod_user(cli);                                                               // call
        expect(data).toStrictEqual(doc);                                                                // data
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // SUCCESSFUL moduser (quota)
    // -----------------------------------------------------------------------------------------
    it('moduser - Successful Mod (quota only) - Should return a successful reply containing result doc', async (done) => {
        
        let doc = {
            quota: 5,
            quota_limit: 5,
            last_refresh: '2020-02-25T10:05:48.000Z',
            role: 'USER',
            _id: '5e550f5df06e503794a5f10e',
            username: 'user',
            passwd: '$2a$10$3JsK8EEd./TQcorHMJ5JP.uYqEO20Xoz3HqdCUtp8M4K3ndCYeZdS',
            email: 'user@gmail.com',
            __v: 0
          };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: doc 
            })
        );

        // argument - mod passwd only
        let cli = {
            moduser: 'User1',
            quota: 40
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        
        // updateOps should be
        let info = qs.stringify({                                                                                                           // data we must put
            quota: 40
        });
        
        const data = await mod_user(cli);                                                               // call
        expect(data).toStrictEqual(doc);                                                                // data
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------



    // SUCCESSFUL moduser (passwd, email)
    // -----------------------------------------------------------------------------------------
    it('moduser - Successful Mod (passwd, email) - Should return a successful reply containing result doc', async (done) => {
        
        let doc = {
            quota: 10,
            quota_limit: 10,
            last_refresh: '2020-02-25T10:05:48.000Z',
            role: 'USER',
            _id: '5e550f5df06e503794a5f10e',
            username: 'user',
            passwd: '$2a$10$3JsK8EEd./TQcorHMJ5JP.uYqEO20Xoz3HqdCUtp8M4K3ndCYeZdS',
            email: 'user@gmail.com',
            __v: 0
          };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: doc 
            })
        );

        // argument - mod passwd and email 
        let cli = {
            moduser: 'User1',
            passw: 'newpass',
            email: 'updated@gmail.com'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        
        // updateOps should be
        let info = qs.stringify({                                                                                                           // data we must put
            passwd: 'newpass',
            email: 'updated@gmail.com'
        });
        
        const data = await mod_user(cli);                                                               // call
        expect(data).toStrictEqual(doc);                                                                // data
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------

    
    // SUCCESSFUL moduser (passwd, quota)
    // -----------------------------------------------------------------------------------------
    it('moduser - Successful Mod (passwd, quota) - Should return a successful reply containing result doc', async (done) => {
        
        let doc = {
            quota: 10,
            quota_limit: 10,
            last_refresh: '2020-02-25T10:05:48.000Z',
            role: 'USER',
            _id: '5e550f5df06e503794a5f10e',
            username: 'user',
            passwd: '$2a$10$3JsK8EEd./TQcorHMJ5JP.uYqEO20Xoz3HqdCUtp8M4K3ndCYeZdS',
            email: 'user@gmail.com',
            __v: 0
          };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: doc 
            })
        );

        // argument - mod passw, quota
        let cli = {
            moduser: 'User1',
            passw: 'newpass',
            quota: 40
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        
        // updateOps should be
        let info = qs.stringify({                                                                                                           // data we must put
            passwd: 'newpass',
            quota: 40
        });
        
        const data = await mod_user(cli);                                                               // call
        expect(data).toStrictEqual(doc);                                                                // data
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    

    // SUCCESSFUL moduser (passwd, quota)
    // -----------------------------------------------------------------------------------------
    it('moduser - Successful Mod (email, quota) - Should return a successful reply containing result doc', async (done) => {
        
        let doc = {
            quota: 10,
            quota_limit: 10,
            last_refresh: '2020-02-25T10:05:48.000Z',
            role: 'USER',
            _id: '5e550f5df06e503794a5f10e',
            username: 'user',
            passwd: '$2a$10$3JsK8EEd./TQcorHMJ5JP.uYqEO20Xoz3HqdCUtp8M4K3ndCYeZdS',
            email: 'user@gmail.com',
            __v: 0
          };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: doc 
            })
        );

        // argument - mod passw, quota
        let cli = {
            moduser: 'User1',
            email: 'newmail@gmail.com',
            quota: 40
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        
        // updateOps should be
        let info = qs.stringify({                                                                                                           // data we must put
            email: 'newmail@gmail.com',
            quota: 40
        });
        
        const data = await mod_user(cli);                                                               // call
        expect(data).toStrictEqual(doc);                                                                // data
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    


    // SUCCESSFUL moduser (passwd, email, quota)
    // -----------------------------------------------------------------------------------------
    it('moduser - Successful Mod (passwd, email, quota) - Should return a successful reply containing result doc', async (done) => {
        
        let doc = {
            quota: 10,
            quota_limit: 10,
            last_refresh: '2020-02-25T10:05:48.000Z',
            role: 'USER',
            _id: '5e550f5df06e503794a5f10e',
            username: 'user',
            passwd: '$2a$10$3JsK8EEd./TQcorHMJ5JP.uYqEO20Xoz3HqdCUtp8M4K3ndCYeZdS',
            email: 'user@gmail.com',
            __v: 0
          };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: doc 
            })
        );

        // argument - mod passw, quota
        let cli = {
            moduser: 'User1',
            email: 'newmail@gmail.com',
            quota: 40,
            passw: '123'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        
        // updateOps should be
        let info = qs.stringify({                                                                                                           // data we must put
            passwd: '123',
            email: 'newmail@gmail.com',
            quota: 40
        });
        
        const data = await mod_user(cli);                                                               // call
        expect(data).toStrictEqual(doc);                                                                // data
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
    // ###################################################################################################################################

    // ERROR RESPONSE
    // ###################################################################################################################################
    // EXISTING NEW USER 
    // -----------------------------------------------------------------------------------------
    it('moduser - Existing User - Should return an error response msg', async (done) => {
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
        axios.put.mockImplementationOnce(() =>
            Promise.reject( 
                error
            )
        );

        // argument
        let cli = {
            moduser: 'User1',
            passw: '123',
            quota: 40,
            email: 'existing@gmail.com'
        }
        
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        let info = qs.stringify({                                                                                                           // data we must put
            passwd: '123',
            email: 'existing@gmail.com',
            quota: 40,
        });
        
        const data = await mod_user(cli);                                                                // call
        expect(data).toStrictEqual({ message: 'Bad request', code: 400, additional: 'User specified by info provided already exists'  });  // data should be the error (response)
        expect(axios.put).toHaveBeenCalledTimes(1);                                                     // should do the request
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);                                     // must be called with correct url, data and headers
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################

    // VALIDATIONS
    // ###################################################################################################################################
    // NO TOKEN CALL
    // -----------------------------------------------------------------------------------------
    it('moduser - No token - Should return an auth error msg, without request', async (done) => {
        process.env.TOKEN = './tests/Administration/non_existent.token';

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            moduser: 'User1',
            passw: '123',
            quota: 40,
            email: 'user1@gmail.com'
        }
        
        
        const data = await mod_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.AUTH_ERROR);                                                 // data should be the AUTH ERR msg
        expect(axios.put).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------




    
    // INVALID EMAIL INPUT
    // -----------------------------------------------------------------------------------------
    it('moduser - Invalid email - Should return an email error msg without call', async (done) => {
    
        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            moduser: 'User1',
            passw: '123',
            quota: 40,
            email: 'user1gmail.com'
        }
        
        
        const data = await mod_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.EMAIL_ERROR);                                                 // data should be the EMAIL ERROR
        expect(axios.put).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    
    
    // NON NUMERIC QUOTA CALL
    // -----------------------------------------------------------------------------------------
    it('moduser - Invalid quota - Should return an quota error msg without call', async (done) => {
    
        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            moduser: 'User1',
            passw: '123',
            quota: 'A23',
            email: 'user1@gmail.com'
        }
        
        
        const data = await mod_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.QUOTA_ERROR);                                                 // data should be the QUOTA ERROR
        expect(axios.put).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------


    // PASSWD LEN ERROR
    // -----------------------------------------------------------------------------------------
    it('moduser - Invalid passwd - Should return an passwd error msg without call', async (done) => {
    
        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            moduser: 'User1',
            passw: '12',
            quota: 40,
            email: 'user1@gmail.com'
        }
        
        
        const data = await mod_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.PASSWD_ERROR);                                                 // data should be the QUOTA ERROR
        expect(axios.put).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------



    // REQUIRED PARAMETER MISSING (all parameters)
    // -----------------------------------------------------------------------------------------
    it('moduser - all options missing - Should return parameters error msg without call', async (done) => {
    
        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.reject( 
                {}
            )
        );

        // argument
        let cli = {
            moduser: 'User1'
        }
        
        
        const data = await mod_user(cli);                                                                // call
        expect(data).toStrictEqual(messages.MOD_PARAMS);                                            // data should be the QUOTA ERROR
        expect(axios.put).toHaveBeenCalledTimes(0);                                                     // should not do the request
        
        done();    
    });
    // -----------------------------------------------------------------------------------------
    // ###################################################################################################################################


    // SERVER OFF
    // ###################################################################################################################################
    // -----------------------------------------------------------------------------------------
    it('moduser - server off error msg', async (done) => {
        let error = {
            code: 'ECONNREFUSED', errno: 'ECONNREFUSED', address: '127.0.0.1' 
        };

        // setup - get
        axios.put.mockImplementationOnce(() =>
            Promise.reject( 
                error
            )
        );

        // argument
        let cli = {
            moduser: 'User1',
            quota: 10
        }
        // url and headers we expect
        let url = 'http://localhost:8765/energy/api/Admin/users/User1';                                                                           // put url
        let headers = {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8", "x_observatory_auth": "abcdef"}};     // headers
        let info = qs.stringify({                                                                                                           // data we must put
            quota: 10
        });

        const data = await mod_user(cli);                    // call
        expect(data).toStrictEqual({ code: error.code, no: error.errno, address: error.address});        // we are expecting the error
        expect(axios.put).toHaveBeenCalledTimes(1);             // request should be made
        expect(axios.put).toHaveBeenCalledWith(url, info, headers);   // must be called with correct url and headers

        done();    
    });
    // -----------------------------------------------------------------------------------------

});