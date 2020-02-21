const app = require('../../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const qs = require('qs');

// need mongoose and User model
const mongoose = require('mongoose');
const User = require('../../../api/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BlackList = require('../../../api/models/BlackListedToken');


// user creation endpoint
// ================================================================================================================================================
describe('POST /energy/api/Admin/users', () => {

    let token1 = '';    // single user token
    let token2 = '';    // admin user token

    let token_exp = ''; // expired token



    // before start, setup some environmental variables
    beforeAll(async function(done){
        // set environment variables (test)
        process.env.URL = "http://localhost:8765";
        process.env.PORT = "8765";
        process.env.HOME = "/energy/api";
        process.env.JWT_KEY = "secret";
        process.env.MONGO_CONNECT = "mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
     
        mongoose.set('useCreateIndex', true);
        // init
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            await User.deleteMany({username: {$regex: 'test'}});
            await User.deleteMany({username: 'admin'});
            await BlackList.deleteMany({});
        }catch(err){
            console.log(err);
        }
       


        try{

            // VALID USER TOKEN
            // ---------------------------------------------
            token1 = jwt.sign({
                username: 'test1',
                email: 'test1@gmail.com',
                role: 'USER'
            }, 

            process.env.JWT_KEY || 'secret',
            {
                expiresIn: "2h"
            });
            // ---------------------------------------------


            // BLACKLISTED TOKEN
            // ---------------------------------------------
            token2 = jwt.sign({
                username: 'test2',
                email: 'test2@gmail.com',
                role:'USER'
            },
            process.env.JWT_KEY || 'secret',
            {
                expiresIn: "2h"
            });
            // ---------------------------------------------
            
            // EXPIRED TOKEN
            // ---------------------------------------------
            token_exp = jwt.sign({
                username: 'expired',
                email: 'expired@gmail.com',
                role: 'USER'
            }, 
            process.env.JWT_KEY || 'secret',
            {
                expiresIn: "-1s"
            });
            // ---------------------------------------------

            // create a user to view status
            let user1 = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'test1',
                passwd: bcrypt.hashSync('123',10),
                email: 'test1@gmail.com',
                quota: 100,           
                quota_limit: 100,
                role: 'USER',
                last_refresh: new Date() 
            });
    
            // create a user to view status
            let user2 = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'test2',
                passwd: bcrypt.hashSync('123',10),
                email: 'test2@gmail.com',
                quota: 100,           
                quota_limit: 100,
                role: 'USER',
                last_refresh: new Date() 
            });
            
    
            await user1.save();
            await user2.save();


            // blacklist the token (token2)
            let date = new Date();
            date.setDate(date.getDate() + 1);
            let bl = new BlackList({
                _id: new mongoose.Types.ObjectId(),
                Token: token2,
                expAt: date
            })

            await bl.save();
            await mongoose.disconnect(); 

            done();
        
        }catch(err){
            done(err);
            process.exit(1);
        }

        
     });

     afterAll(async function(done){
         if(mongoose.connection.readyState === 1) mongoose.disconnect();
         done();
     })

    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************



    // 200 OK TESTS BEGIN

    // POST - 200 - token created
    /**
     * Successful login with user, should return a 200 ok with a token
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (test1 - 123)', async done => {
        
        try{
            
            // login admin
            let res = await request.post('/energy/api/Login')
            .expect(200)
            .send(qs.stringify({username: 'test1', passw: '123'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});

            console.log(res.body);
    
            expect(res.body).toHaveProperty('token');
            
            let verified = jwt.verify(res.body.token, process.env.JWT_KEY);

            expect(verified).toHaveProperty('username');
            expect(verified).toHaveProperty('email');
            expect(verified).toHaveProperty('role');

            expect(verified.username).toBe('test1');
            expect(verified.email).toBe('test1@gmail.com');
            expect(verified.role).toBe('USER');
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    

    // POST - 200 - token created
    /**
     * Successful login with user, that provides EXPIRED TOKEN, should return a 200 ok with a token
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK - EXPIRED TOKEN (test1 - 123)', async done => {
        
        try{
            
            // login admin
            let res = await request.post('/energy/api/Login')
            .expect(200)
            .send(qs.stringify({username: 'test1', passw: '123'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'x_observatory_auth':token_exp});

            console.log(res.body);
    
            expect(res.body).toHaveProperty('token');
            
            let verified = jwt.verify(res.body.token, process.env.JWT_KEY);

            expect(verified).toHaveProperty('username');
            expect(verified).toHaveProperty('email');
            expect(verified).toHaveProperty('role');

            expect(verified.username).toBe('test1');
            expect(verified.email).toBe('test1@gmail.com');
            expect(verified.role).toBe('USER');
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


     // POST - 200 - token created
    /**
     * Successful login with user, that provides BLACKLISTED TOKEN, should return a 200 ok with a token
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK - BLACKLISTED TOKEN (test2 - 123)', async done => {
        
        try{
            
            let res = await request.post('/energy/api/Login')
            .expect(200)
            .send(qs.stringify({username: 'test2', passw: '123'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'x_observatory_auth': token2});

            console.log(res.body);
    
            expect(res.body).toHaveProperty('token');
            
            let verified = jwt.verify(res.body.token, process.env.JWT_KEY);

            expect(verified).toHaveProperty('username');
            expect(verified).toHaveProperty('email');
            expect(verified).toHaveProperty('role');

            expect(verified.username).toBe('test2');
            expect(verified.email).toBe('test2@gmail.com');
            expect(verified.role).toBe('USER');
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    

    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // BAD REQUEST TESTS BEGIN
    

    /**
     *  POST - 400 - Missing password parameter
     *  Should return a bad request body with additional information
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (test1)', async done => {
        
        try{
            
            let res = await request.post('/energy/api/Login')
            .expect(400)
            .send(qs.stringify({username: 'test1'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});

            console.log(res.body);
            
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');
            expect(res.body).not.toHaveProperty('token');

            expect(res.body.message).toBe('Bad request');
            expect(res.body.code).toBe(400);
            expect(res.body.additional).toBe('Missing required parameters - username or password');
            done();
        
        }catch(err){done(err);}
    }); 
    // ---------------------------------------------------------------------------------------------------------------------------


     /**
     *  POST - 400 - Missing username parameter
     *  Should return a bad request body with additional information
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (passord only)', async done => {
        
        try{
            
            let res = await request.post('/energy/api/Login')
            .expect(400)
            .send(qs.stringify({password: '123'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});

            console.log(res.body);
            
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');
            expect(res.body).not.toHaveProperty('token');
            
            expect(res.body.message).toBe('Bad request');
            expect(res.body.code).toBe(400);
            expect(res.body.additional).toBe('Missing required parameters - username or password');
            done();
        
        }catch(err){done(err);}
    }); 
    // ---------------------------------------------------------------------------------------------------------------------------


    /**
     *  POST - 400 - Already have a valid token
     *  Should return a bad request body with additional information
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (valid token)', async done => {
        
        try{
            
            let res = await request.post('/energy/api/Login')
            .expect(400)
            .send(qs.stringify({username:'test', password: '123'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'x_observatory_auth': token1});

            console.log(res.body);

            // expect basic error response body
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');

            expect(res.body.message).toBe('Bad request');
            expect(res.body.code).toBe(400);

            // additional will be an object with message and verified properties
            expect(res.body.additional).toHaveProperty('message');
            expect(res.body.additional).toHaveProperty('verified');

            expect(res.body.additional.message).toBe('You already have a valid token');
            
            // verified object will contain the token information (jwt)
            expect(res.body.additional.verified).toHaveProperty('username');
            expect(res.body.additional.verified).toHaveProperty('email');
            expect(res.body.additional.verified).toHaveProperty('role');

            expect(res.body.additional.verified.username).toBe('test1');
            expect(res.body.additional.verified.email).toBe('test1@gmail.com');
            expect(res.body.additional.verified.role).toBe('USER');
            
            done();
        
        }catch(err){done(err);}
    }); 
    // ---------------------------------------------------------------------------------------------------------------------------


    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // 401 - NOT AUTH TESTS BEGIN

    // POST - 401 - wrong username
    /**
     * Login using non existent username
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (non_existent)', async done => {
        
        try{
            
            // login admin
            let res = await request.post('/energy/api/Login')
            .expect(401)
            .send(qs.stringify({username: 'non_existent', passw: '123'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});

            console.log(res.body);
    
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');
            expect(res.body).not.toHaveProperty('token');

            expect(res.body.message).toBe('Not authorized');
            expect(res.body.code).toBe(401);
            expect(res.body.additional).toBe('Username or password error');
            
            
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // POST - 401 - wrong password
    /**
     * Login using wrong password
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (test1 - wrong password)', async done => {
        
        try{
            
            // login admin
            let res = await request.post('/energy/api/Login')
            .expect(401)
            .send(qs.stringify({username: 'test1', passw: '13'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});

            console.log(res.body);
    
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');
            expect(res.body).not.toHaveProperty('token');
            
            expect(res.body.message).toBe('Not authorized');
            expect(res.body.code).toBe(401);
            expect(res.body.additional).toBe('Username or password error');
            
            
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    


});