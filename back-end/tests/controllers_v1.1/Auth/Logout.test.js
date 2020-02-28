const app = require('../../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const qs = require('qs');

// need mongoose and User model
const mongoose = require('mongoose');
const User = require('../../../api/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Blacklist = require('../../../api/models/BlackListedToken');


// user creation endpoint
// ================================================================================================================================================
describe('POST /energy/api/Admin/users', () => {

    let token1 = '';    // single user token
    let token_exp = ''; // expired token
    let verified1 = '';

    

    // before start, setup some environmental variables
    beforeAll(async function(done){
        // set environment variables (test)
        process.env.URL = "http://localhost:8765";
        process.env.PORT = "8765";
        process.env.HOME = "/energy/api";
        process.env.JWT_KEY = "secret";
        process.env.MONGO_CONNECT = "mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
     
        mongoose.set('useCreateIndex', true);
        
            
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            await User.deleteMany({username: {$regex: 'test'}});
            await User.deleteMany({username: 'admin'});
            await Blacklist.deleteMany({});
        }catch(err){
            console.log(err);
        }


        try{
            
            // create user
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
            
    
            await user1.save();
            await mongoose.disconnect();

            
            done();
        
        }catch(err){
            done(err);
            process.exit(1);
        }

        
     });


    
    beforeEach(async function(done){
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

        try{
            verified1 = jwt.verify(token1, process.env.JWT_KEY);
        }catch(err){done(err);}

        done();
    });

    afterEach(async function(done){
        await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
        await Blacklist.deleteMany({});
        await mongoose.disconnect();
        done();
    })


    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************

    // 200 OK TESTS BEGIN

    // POST - 200 - token blacklisted
    /**
     * Successful logout, blackist the token that belongs to a valid user
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (test1 - logout)', async done => {
        
        try{        
            let res = await request.post('/energy/api/Logout')
            .expect(200)
            .set({'x_observatory_auth': token1});

            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            let bl = await Blacklist.findOne({Token: token1});  // find the blacklisted token
            
            // it should exist and have valid options
            expect(bl).not.toBe(null);
            expect(bl.Token).toBe(token1);
            expect(bl.expAt).toStrictEqual(new Date(verified1.exp * 1000))
            await mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    

    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // NOT AUTH TESTS BEGIN

    // POST - 401 - non existent token to blacklist
    /**
     * User logouts without token. The logout route is protected by the logged_in middleware (protects all protected routes)
     * Therefore we expect a 401 NOT AUTH. The 401 should be treated as "you cannot logout if you are not logged in" in this case
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (none - logout)', async done => {
        
        try{        
            let res = await request.post('/energy/api/Logout')
            .expect(401)
            
            console.log(res.body);
            
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');

            expect(res.body.message).toBe('Not authorized');
            expect(res.body.code).toBe(401);
            expect(res.body.additional).toBe('You do not have a valid token');

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    
    // POST - 401 - expired token to blacklist
    /**
     * User logs out, providing an expired token. It will fail --> the time expired token will not be blacklisted
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (time expired - logout)', async done => {
        
        try{        
            let res = await request.post('/energy/api/Logout')
            .expect(401)
            .set({'x_observatory_auth': token_exp});
            
            console.log(res.body);
            
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');

            expect(res.body.message).toBe('Not authorized');
            expect(res.body.code).toBe(401);
            expect(res.body.additional).toBe('You do not have a valid token');

            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            let bl = await Blacklist.findOne({Token: token_exp});  // find the blacklisted token
            
            // it should ΝΟΤ exist - do not blacklist the time expired token
            expect(bl).toBe(null);
            await mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // POST - 401 -  blacklisted token to blacklist
    /**
     * User logs out, providing a blacklisted token. It will fail --> the blacklisted token will not be blacklisted again 
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (blacklisted token - logout)', async done => {
        
        try{        
            // do an initial logout with our valid token to blacklist it
            await request.post('/energy/api/Logout')
            .expect(200)
            .set({'x_observatory_auth': token1});

            // do an extra logout request with the blacklisted token
            let res = await request.post('/energy/api/Logout')
            .expect(401)
            .set({'x_observatory_auth': token1});
 
            
            console.log(res.body);
            
            // expect the not auth message
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('additional');

            expect(res.body.message).toBe('Not authorized');
            expect(res.body.code).toBe(401);
            expect(res.body.additional).toBe('You do not have a valid token');

            // and expect to find the blacklisted token to our db
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            let bl = await Blacklist.findOne({Token: token1});  // find the blacklisted token
            
            // it should exist from the previous logout
            expect(bl).not.toBe(null);
            expect(bl.Token).toBe(token1);
            expect(bl.expAt).toStrictEqual(new Date(verified1.exp * 1000))
            await mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


});






      /*
            let date = new Date();
            date.setSeconds(date.getSeconds() + 15);
            await Blacklist.updateOne({Token:token1},{expAt:date}); // set the expiration to yesterday
            

            await new Promise(r => setTimeout(r, 20000));
            bl = await Blacklist.findOne({Token:token1});
            expect(bl).toBe(null);
            await mongoose.disconnect();
            */