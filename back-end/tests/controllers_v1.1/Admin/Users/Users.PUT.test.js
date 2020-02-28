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
            
            // super
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
            // user
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
            
            // admin
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



    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // 200 OK TESTS BEGIN

    // PUT - 200 user updated
    /**
     * update existing user email
     * {
     *  username: test1
     *  passwd: 123
     *  email: test1[at]gmail.com -> test1_updated[at]gmail.com
     *  quota: 100
     * }
     * 
     * it should return 200-ok and the response body of the updated document on db
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - moduser - email)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test1')
            .expect(200)
            .send(qs.stringify({email: 'test1_updated@gmail.com'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token

            // no need to check in database. The json body is the document fetched from the database after the update
            expect(res.body).toHaveProperty('username')
            expect(res.body.username).toBe('test1');

            expect(res.body).toHaveProperty('passwd')
            expect(bcrypt.compareSync('123', res.body.passwd)).toBe(true);

            expect(res.body).toHaveProperty('email');
            expect(res.body.email).toBe('test1_updated@gmail.com');

            expect(res.body).toHaveProperty('quota');
            expect(res.body.quota).toBe(100);

            expect(res.body).toHaveProperty('quota_limit');
            expect(res.body.quota_limit).toBe(100);


            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



    // PUT - 200 user updated
    /**
     * update existing user email AND quota
     * {
     *  username: test1
     *  passwd: 123
     *  email: test1_updated[at]gmail.com -> test1[at]gmail.com
     *  quota: 100 -> 200
     * }
     * 
     * it should return 200-ok and the response body of the updated document on db
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - moduser - email,quota)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test1')
            .expect(200)
            .send(qs.stringify({email: 'test1@gmail.com', quota:200}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token

            // no need to check in database. The json body is the document fetched from the database after the update
            expect(res.body).toHaveProperty('username')
            expect(res.body.username).toBe('test1');

            expect(res.body).toHaveProperty('passwd')
            expect(bcrypt.compareSync('123', res.body.passwd)).toBe(true);

            expect(res.body).toHaveProperty('email');
            expect(res.body.email).toBe('test1@gmail.com');

            expect(res.body).toHaveProperty('quota');
            expect(res.body.quota).toBe(200);

            expect(res.body).toHaveProperty('quota_limit');
            expect(res.body.quota_limit).toBe(200);


            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // PUT - 200 user updated
    /**
     * update existing user email AND quota AND passwd
     * {
     *  username: test1
     *  passwd: 123 -> 1234
     *  email: test1[at]gmail.com -> test1_updated[at]gmail.com
     *  quota: 200 -> 100
     * }
     * 
     * it should return 200-ok and the response body of the updated document on db
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - moduser - allfields)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test1')
            .expect(200)
            .send(qs.stringify({email: 'test1_updated@gmail.com', quota:100, passwd:'1234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token

            // no need to check in database. The json body is the document fetched from the database after the update
            expect(res.body).toHaveProperty('username')
            expect(res.body.username).toBe('test1');

            expect(res.body).toHaveProperty('passwd')
            expect(bcrypt.compareSync('1234', res.body.passwd)).toBe(true);

            expect(res.body).toHaveProperty('email');
            expect(res.body.email).toBe('test1_updated@gmail.com');

            expect(res.body).toHaveProperty('quota');
            expect(res.body.quota).toBe(100);

            expect(res.body).toHaveProperty('quota_limit');
            expect(res.body.quota_limit).toBe(100);


            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // BAD REQUEST TESTS BEGIN

    // PUT - 400 BAD REQUEST (USER NOT FOUND)
    /**
     * update non existing user
     * it should return 400-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - moduser - NON EXISTING)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test500')
            .expect(400)
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('User not found');

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // PUT - 400 BAD REQUEST (NO OPTION PROVIDED)
    /**
     * update existing user, NO FIELD
     * {
     *  username: test1
     *  passwd: 1234
     *  email: test1_updated[at]gmail.com
     *  quota: 100
     * }
     * 
     * it should return 400-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - moduser - NOFIELD)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test1')
            .expect(400)
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('Need to speciffy at least 1 option to update');


            // check in database - NO CHANGES MUST BE MADE
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const not_updated = await User.findOne({username:'test1'});
            expect(not_updated).not.toBe(null);

            
            expect(not_updated.username).toBe('test1');
            expect(bcrypt.compareSync('1234', not_updated.passwd)).toBe(true);
            expect(not_updated.email).toBe('test1_updated@gmail.com');
            expect(not_updated.quota).toBe(100);
            expect(not_updated.quota_limit).toBe(100);
            mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



    // PUT - 400 BAD REQUEST (Bad email format given for update)
    /**
     * update existing user, BAD EMAIL
     * {
     *  username: test1
     *  passwd: 1234
     *  email: test1_updated[at]gmail.com
     *  quota: 100
     * }
     * 
     * it should return 400-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - moduser - BAD EMAIL FORMAT)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test1')
            .expect(400)
            .send(qs.stringify({email: 'BADEMAIL.com', quota:1200, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("Email provided is not a valid email: BADEMAIL.com");


            // check in database - NO CHANGES MUST BE MADE
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const not_updated = await User.findOne({username:'test1'});
            expect(not_updated).not.toBe(null);

            
            expect(not_updated.username).toBe('test1');
            expect(bcrypt.compareSync('1234', not_updated.passwd)).toBe(true);
            expect(not_updated.email).toBe('test1_updated@gmail.com');
            expect(not_updated.quota).toBe(100);
            expect(not_updated.quota_limit).toBe(100);
            mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



    // PUT - 400 BAD REQUEST (EMAIL EXISTS)
    /**
     * update existing user, EMAIL EXISTS
     * {
     *  username: test1
     *  passwd: 1234
     *  email: test1_updated[at]gmail.com
     *  quota: 100
     * }
     * 
     * it should return 400-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - moduser - EMAIL EXISTS)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test1')
            .expect(400)
            .send(qs.stringify({email: 'test2@gmail.com', quota:1200, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("Email provided already exists");


            // check in database - NO CHANGES MUST BE MADE
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const not_updated = await User.findOne({username:'test1'});
            expect(not_updated).not.toBe(null);

            
            expect(not_updated.username).toBe('test1');
            expect(bcrypt.compareSync('1234', not_updated.passwd)).toBe(true);
            expect(not_updated.email).toBe('test1_updated@gmail.com');
            expect(not_updated.quota).toBe(100);
            expect(not_updated.quota_limit).toBe(100);
            mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------




    // PUT - 400 BAD REQUEST (ADMIN quota)
    /**
     * update ADMIN quota should not happen
     * {
     *  username: test2
     *  passwd: 123
     *  email: test2[at]gmail.com
     *  quota: -1
     * }
     * 
     * it should return 400-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - moduser - ADMIN QUOTA)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/test2')
            .expect(400)
            .send(qs.stringify({email: 'test2@gmail.com', quota:14, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("Quota cannot be changed on admin OR super user");


            // check in database - NO CHANGES MUST BE MADE
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const not_updated = await User.findOne({username:'test2'});
            expect(not_updated).not.toBe(null);

            
            expect(not_updated.username).toBe('test2');
            expect(bcrypt.compareSync('123', not_updated.passwd)).toBe(true);
            expect(not_updated.email).toBe('test2@gmail.com');
            expect(not_updated.quota).toBe(-1);
            expect(not_updated.quota_limit).toBe(-1);
            mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // PUT - 400 BAD REQUEST (SUPER quota)
    /**
     * update SUPER quota should not happen
     * {
     *  username: admin
     *  passwd: 123
     *  email: super[at]gmail.com
     *  quota: -1
     * }
     * 
     * it should return 400-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - moduser - SUPER QUOTA)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/admin')
            .expect(400)
            .send(qs.stringify({email: 'test2@gmail.com', quota:14, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token});  // SUPER token
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("Quota cannot be changed on admin OR super user");


            // check in database - NO CHANGES MUST BE MADE
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const not_updated = await User.findOne({username:'admin'});
            expect(not_updated).not.toBe(null);

            
            expect(not_updated.username).toBe('admin');
            expect(bcrypt.compareSync('321nimda', not_updated.passwd)).toBe(true);
            expect(not_updated.email).toBe('super@gmail.com');
            expect(not_updated.quota).toBe(-1);
            expect(not_updated.quota_limit).toBe(-1);
            mongoose.disconnect();
            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // NOT AUTH REPLIES BEGIN
    
    // PUT - 401 NOT AUTH (NO TOKEN)
    /**
     * it should return 401-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (NO TOKEN - moduser)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/abc')
            .expect(401)
            .send(qs.stringify({email: 'test2@gmail.com', quota:14, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});  // NO TOKEN
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("You do not have a valid token");

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



        
    // PUT - 401 NOT AUTH (EXPIRED TOKEN)
    /**
     * it should return 401-NA and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (EXPIRED - moduser)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/abc')
            .expect(401)
            .send(qs.stringify({email: 'test2@gmail.com', quota:14, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8','X_OBSERVATORY_AUTH':token_exp});  // EXPIRED TOKEN
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("You do not have a valid token");

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



    // PUT - 401 NOT AUTH (NON ADMIN TOKEN)
    /**
     * it should return 401-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (NON SUPER/ADMIN TOKEN - moduser)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/abc')
            .expect(401)
            .send(qs.stringify({email: 'test2@gmail.com', quota:14, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token1});  // USER TOKEN
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("You need Administrator privileges to access this");

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    
    // PUT - 401 NOT AUTH (ADMIN MODIFIES SUPER)
    /**
     * it should return 401-BR and additional info
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (ADMIN - moduser - SUPER)', async done => {
        try{
            const res = await request.put('/energy/api/Admin/users/admin')
            .expect(401)
            .send(qs.stringify({email: 'test2@gmail.com', quota:14, passwd:'12234'}))
            .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 'X_OBSERVATORY_AUTH':token2});  // USER TOKEN
            
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe("Only SUPER can mod ADMIN or SUPER");

            // database check -- NO CHANGES EXPECTED
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const not_updated = await User.findOne({username:'admin'});
            expect(not_updated).not.toBe(null);

            
            expect(not_updated.username).toBe('admin');
            expect(bcrypt.compareSync('321nimda', not_updated.passwd)).toBe(true);
            expect(not_updated.email).toBe('super@gmail.com');
            expect(not_updated.quota).toBe(-1);
            expect(not_updated.quota_limit).toBe(-1);
            done();
        
        }
        catch(err){done(err);}
        finally{
            if(mongoose.connection.readyState === 1) mongoose.disconnect();
        }
    });        
    // ---------------------------------------------------------------------------------------------------------------------------






});