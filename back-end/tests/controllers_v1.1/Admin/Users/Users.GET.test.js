const app = require('../../../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const qs = require('qs');

// need mongoose and User model
const mongoose = require('mongoose');
const User = require('../../../../api/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// user status endpoint
// ================================================================================================================================================
describe('GET /energy/api/Admin/Users/{:username}', () => {
    let token = '';     // admin token
    let token1 = '';    // single user token
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

            
            // VALID USER TOKEN - QUOTA ERROR
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



            // create users 
            // -----------------------------------------------------------
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
            // -----------------------------------------------------------

            await admin.save();
            await user1.save();
            await mongoose.disconnect();

           

            done();
        
        }catch(err){
            done(err);
            process.exit(1);
        }

        
     });


    // GET - 200
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - userstatus(test1))', async done => {
        request.get('/energy/api/Admin/users/test1')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(200)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('username');
                expect(res.body.username).toBe('test1');

                expect(res.body).toHaveProperty('email');
                expect(res.body.email).toBe('test1@gmail.com');

                expect(res.body).toHaveProperty('quota');
                expect(res.body.quota).toBe(100);

                expect(res.body).toHaveProperty('role');
                expect(res.body.role).toBe('USER');
                
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 200
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - userstatus(admin))', async done => {
        request.get('/energy/api/Admin/users/admin')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(200)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('username');
                expect(res.body.username).toBe('admin');

                expect(res.body).toHaveProperty('email');
                expect(res.body.email).toBe('super@gmail.com');

                expect(res.body).toHaveProperty('quota');
                expect(res.body.quota).toBe(-1);

                expect(res.body).toHaveProperty('role');
                expect(res.body.role).toBe('SUPER');
                
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 400 BAD REQUEST (non existent user)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - userstatus(abc_non_existent))', async done => {
        request.get('/energy/api/Admin/users/abc_non_existent')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Bad request');

                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(400);

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('User not found');
                
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 400 BAD REQUEST (FORM)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - FORM)', async done => {
        request.get('/energy/api/Admin/user/test1') // should be users not user
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Bad request');

                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(400);

                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // GET - 401 NOT AUTH (NO TOKEN)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (NO TOKEN)', async done => {
        request.get('/energy/api/Admin/users/test1')
        .expect(401)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Not authorized');

                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(401);

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('You do not have a valid token');

                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 401 NOT AUTH (EXPIRED TOKEN)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (EXPIRED TOKEN)', async done => {
        request.get('/energy/api/Admin/users/test1')
        .expect(401)
        .set({'X_OBSERVATORY_AUTH':token_exp})
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Not authorized');

                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(401);

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('You do not have a valid token');

                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 401 NOT AUTH (INVALID ROLE)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (INVALID ROLE)', async done => {
        request.get('/energy/api/Admin/users/test1')
        .expect(401)
        .set({'X_OBSERVATORY_AUTH':token1})
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Not authorized');

                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(401);

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('You need Administrator privileges to access this');

                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

});
// ================================================================================================================================================
