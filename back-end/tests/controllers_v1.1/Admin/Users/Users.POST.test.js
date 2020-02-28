const app = require('../../../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const qs = require('qs');

// need mongoose and User model
const mongoose = require('mongoose');
const User = require('../../../../api/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// user creation endpoint
// ================================================================================================================================================
describe('POST /energy/api/Admin/users', () => {

    let token = '';     // admin token
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
        process.env.MONGO_CONNECT = "mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false" 
        
        mongoose.set('useCreateIndex', true);
        // init
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            await User.deleteMany({username: {$regex: 'test'}});
            await User.deleteMany({username: 'admin'});
        }catch(err){
            console.log(err);
        }     
   
        try{


            // admin token
            // ---------------------------------------------
            token = jwt.sign({
                username: 'admin',
                email: 'admin@gmail.com',
                role: 'SUPER'
            }, 

            process.env.JWT_KEY || 'secret',
            {
                expiresIn: "2h"
            });
            // ---------------------------------------------


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


            
            // admin token
            // ---------------------------------------------
            token2 = jwt.sign({
                username: 'test2',
                email: 'test2@gmail.com',
                role: 'ADMIN'
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



            // SUPER USER
            let admin = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'admin',
                passwd: bcrypt.hashSync('321nimda', 10),
                email: 'super@gmail.com',
                quota: -1,
                quota_limit: -1,
                role: 'SUPER'
            });

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
            
            let user2 = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'test2',
                passwd: bcrypt.hashSync('123',10),
                email: 'test2@gmail.com',
                quota: -1,           
                quota_limit: -1,
                role: 'ADMIN',
                last_refresh: new Date() 
            });
            
            await admin.save();
            await user1.save();
            await user2.save();
            await mongoose.disconnect();
                
    
            done();
        
        }catch(err){
            done(err);
            process.exit(1);
        }

        
     });



    // POST - 200 user created
    /**
     * create a user with
     * {
     *  username: created
     *  passwd: 123
     *  email: created[at]gmail.com
     *  quota: 200
     * }
     * 
     * it should return 200-ok and the response body {user_created: 'created'}
     * also, records of database should agree with given information
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - newuser)', async done => {
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(200)
            .send(qs.stringify({username: 'created', passwd: '123', email: 'created@gmail.com', quota:200}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token

            expect(res.body).toHaveProperty('user_created')
            expect(res.body.user_created).toBe('created');

            // check in database
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created'});
            expect(created).not.toBe(null);
            expect(created.username).toBe('created');
            expect(bcrypt.compareSync('123', created.passwd)).toBe(true);
            expect(created.email).toBe('created@gmail.com');
            expect(created.quota).toBe(200);

            await User.deleteOne({username:'created'});
            await mongoose.disconnect();

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // POST - 200 user created
    /**
     * create a user with
     * {
     *  username: created
     *  passwd: 123
     *  email: created[at]gmail.com
     *  quota: 200
     * }
     * 
     * it should return 200-ok and the response body {user_created: 'created'}
     * also, records of database should agree with given information
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (ADMIN - newuser)', async done => {
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(200)
            .send(qs.stringify({username: 'created', passwd: '123', email: 'created@gmail.com', quota:200}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token2}); // ADMIN token

            expect(res.body).toHaveProperty('user_created')
            expect(res.body.user_created).toBe('created');

            // check in database
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created'});
            expect(created).not.toBe(null);
            expect(created.username).toBe('created');
            expect(bcrypt.compareSync('123', created.passwd)).toBe(true);
            expect(created.email).toBe('created@gmail.com');
            expect(created.quota).toBe(200);
            await User.deleteOne({username:'created'});
            
            await mongoose.disconnect();

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



    
    // POST - 400 BAD REQUEST (MISSING PARAMETER PASSWD)
    /**
     *  Submit a create user request, with missing parameters
     *  It should be a 400
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - newuser (forgot password))', async done => {
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(400)
            .send(qs.stringify({username: 'created', email: 'created@gmail.com', quota:200}))   // FORGOT PASSWD
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});

            // response must be
            // ----------------------------------------------
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('You need to provide all options that are required, to create user (username, passwd, email, quota)');
            // ----------------------------------------------

            // check in database - no user should be created
            // ----------------------------------------------
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created'});
            expect(created).toBe(null);
            if(created !== null) await User.deleteOne({username:'created'});
            await mongoose.disconnect();
            // ----------------------------------------------
            done();
        
        }catch(err){done(err);}
        
     });
     // ---------------------------------------------------------------------------------------------------------------------------


    // POST - 400 BAD REQUEST (MISSING PARAMETERS EMAIL)
    /**
     *  Submit a create user request, with missing parameters
     *  It should be a 400
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - newuser (forgot email))', async done => {
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(400)
            .send(qs.stringify({username: 'created', passwd: '123', quota:200}))   // FORGOT EMAIL
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});

            // response must be
            // ----------------------------------------------
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('You need to provide all options that are required, to create user (username, passwd, email, quota)');
            // ----------------------------------------------

            // check in database - no user should be created
            // ----------------------------------------------
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created'});
            expect(created).toBe(null);
            if(created !== null) await User.deleteOne({username:'created'});
            await mongoose.disconnect();
            // ----------------------------------------------
            done();
        
        }catch(err){done(err);}
        
     });
     // ---------------------------------------------------------------------------------------------------------------------------

    // POST - 400 BAD REQUEST (MISSING PARAMETERS QUOTA)
    /**
     *  Submit a create user request, with missing parameters
     *  It should be a 400
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - newuser (forgot quota))', async done => {
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(400)
            .send(qs.stringify({username: 'created', passwd: '123', email: 'created@gmail.com'}))   // FORGOT QUOTA
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});

            // response must be
            // ----------------------------------------------
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('You need to provide all options that are required, to create user (username, passwd, email, quota)');
            // ----------------------------------------------

            // check in database - no user should be created
            // ----------------------------------------------
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created'});
            expect(created).toBe(null);
            if(created !== null) await User.deleteOne({username:'created'});
            await mongoose.disconnect();
            // ----------------------------------------------
            done();
        
        }catch(err){done(err);}
        
    });
    // ---------------------------------------------------------------------------------------------------------------------------


    // POST - 400 BAD REQUEST
    /**
     * create a user with
     * {
     *  username: created
     *  passwd: 123
     *  email: created2[at]gmail.com
     *  quota: 200
     * }
     * 
     * Try to create a user with EXISTING username but different email
     * This should fail with BAD REQUEST
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - newuser(existing username))', async done => {
        // create a user
        await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
        
        // create a user to view status
        let user1 = new User({
            _id: new mongoose.Types.ObjectId(),
            username: 'created',
            passwd: bcrypt.hashSync('123',10),
            email: 'created@gmail.com',
            quota: 100,           
            quota_limit: 100,
            role: 'USER',
            last_refresh: new Date() 
        });

        await user1.save();
        await mongoose.disconnect();

        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(400)
            .send(qs.stringify({username: 'created', passwd: '123', email: 'created2@gmail.com', quota:200}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token}); 


            // response must be
            // ----------------------------------------------
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('User specified by info provided already exists');
            // ----------------------------------------------


            // check in database
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({email:'created2@gmail.com'});
            expect(created).toBe(null);
            await mongoose.disconnect();

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------




    // POST - 400 BAD REQUEST
    /**
     * create a user with
     * {
     *  username: created2
     *  passwd: 123
     *  email: created[at]gmail.com
     *  quota: 200
     * }
     * 
     * Try to create a user with EXISTING email but different username
     * This should fail with BAD REQUEST
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - newuser(existing email))', async done => {       
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(400)
            .send(qs.stringify({username: 'created2', passwd: '123', email: 'created@gmail.com', quota:200}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token}); 


            // response must be
            // ----------------------------------------------
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('User specified by info provided already exists');
            // ----------------------------------------------


            // check in database
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created2'});
            expect(created).toBe(null);
            await User.deleteOne({username:'created'}); // finally delete the user created from the second test
            await mongoose.disconnect();
            
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------








    // POST - 401 NOT AUTH (ADMIN TRIES TO CREATE ADMIN OR SUPER)
    /**
     *  User role ADMIN cannot create other ADMIN, or SUPER user.
     *  Only SUPER users can create other ADMIN, or SUPER users
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (ADMIN - newuser (ADMIN))', async done => {
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(401)
            .send(qs.stringify({username: 'created', passwd: '123', email: 'created@gmail.com', quota: -1, role: 'ADMIN'})) 
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token2}); // ADMIN token

            // response must be
            // ----------------------------------------------
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('Only SUPER can create ADMIN or SUPER');
            // ----------------------------------------------

            // check in database - no user should be created
            // ----------------------------------------------
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created'});
            expect(created).toBe(null);
            if(created !== null) await User.deleteOne({username:'created'});
            await mongoose.disconnect();
            // ----------------------------------------------
            done();
        
        }catch(err){done(err);}
        
     });
     // ---------------------------------------------------------------------------------------------------------------------------



     // POST - 401 NOT AUTH (USER TRIES TO CREATE USER)
    /**
     *  Single user cannot create other user accounts
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (USER - newuser)', async done => {
        try{
            const res = await request.post('/energy/api/Admin/users')
            .expect(401)
            .send(qs.stringify({username: 'created', passwd: '123', email: 'created@gmail.com', quota: -1, role: 'ADMIN'})) 
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token1}); 

            // response must be
            // ----------------------------------------------
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('You need Administrator privileges to access this');
            // ----------------------------------------------

            // check in database - no user should be created
            // ----------------------------------------------
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const created = await User.findOne({username:'created'});
            expect(created).toBe(null);
            if(created !== null) await User.deleteOne({username:'created'});
            await mongoose.disconnect();
            // ----------------------------------------------
            done();
        
        }catch(err){done(err);}
        
     });
     // ---------------------------------------------------------------------------------------------------------------------------




});
// ================================================================================================================================================
