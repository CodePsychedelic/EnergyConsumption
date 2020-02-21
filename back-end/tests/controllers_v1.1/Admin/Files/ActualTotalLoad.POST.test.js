const app = require('../../../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const qs = require('qs');

// need mongoose and User model
const mongoose = require('mongoose');
const User = require('../../../../api/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const ActualTotalLoad = require('../../../../api/models/ActualTotalLoad');

// user creation endpoint
// ================================================================================================================================================
describe('POST /energy/api/Admin/users', () => {

    let token = '';     // admin token
    let token1 = '';    // single user token
    let token2 = '';    // admin user token

    let token_exp = ''; // expired token


    let source = './tests/controllers_v1.1/Admin/Files/ActualTotalLoad_source/';

    // before start, setup some environmental variables
    beforeAll(async function(done){
        // set environment variables (test)
        process.env.URL = "http://localhost:8765";
        process.env.PORT = "8765";
        process.env.HOME = "/energy/api";
        process.env.JWT_KEY = "secret";
        process.env.MONGO_CONNECT = "mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false" 
        process.env.UPLOADS = "./tests/controllers_v1.1/Admin/Files/ActualTotalLoad_uploads/"
        process.env.BATCH_SIZE = 1000;

        
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
        
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
        

        await user1.save();
        await user2.save();
        await mongoose.disconnect();
        // login admin user
        try{
            // login admin
            let res1 = await request.post('/energy/api/Login')
                                    .expect(200)
                                    .send(qs.stringify({username: 'admin', passw: '321nimda'}))
                                    .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});
        
            // login test1 single user
            let res2 = await request.post('/energy/api/Login')
                                    .expect(200)
                                    .send(qs.stringify({username: 'test1', passw: '123'}))
                                    .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});
        
            // login test2 admin user
            let res3 = await request.post('/energy/api/Login')
                                    .expect(200)
                                    .send(qs.stringify({username: 'test2', passw: '123'}))
                                    .set({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'});

            
            token = res1.body.token;
            token1 = res2.body.token;
            token2 = res3.body.token;
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


            done();
        
        }catch(err){
            done(err);
        }

        
     });

     afterAll(async function(done){
        await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
        await User.deleteOne({username:'test1'});
        await User.deleteOne({username:'test2'});
        await mongoose.disconnect();
        
        done();
    });



    afterEach(async function(done){
        const ActualTotalLoad = require('../../../../api/models/ActualTotalLoad');
        await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
        await ActualTotalLoad.deleteMany({AreaName: {$regex:'__TEST__'}}); //find({AreaName: {$regex:'__TEST__'}})
        await mongoose.disconnect();
        process.env.BATCH_SIZE = '30000';
        done();
    });



    

    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************



    // 200 OK TESTS BEGIN

    // POST - 200 ActualTotalLoad_small_healthy.csv inserted
    /**
     * Small csv document with dummy data ({AreaName: '__TEST__')}). Contains 4 records
     * it should return 200-ok and response body with files in record, files inserted, files in db
     * should be 4,4,db+4. No batch is happening
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - ActualTotalLoad - small - healthy - no batch)', async done => {
        
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(200)
            .attach('csv_file', source + "ActualTotalLoad_small_healthy.csv")
            .set({'x_observatory_auth': token});  
            
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('totalRecordsInFile');
            expect(res.body).toHaveProperty('totalRecordsImported');
            expect(res.body).toHaveProperty('totalRecordsInDatabase');

            expect(res.body.totalRecordsInFile).toBe(5);
            expect(res.body.totalRecordsImported).toBe(5);
            expect(res.body.totalRecordsInDatabase).toBe(total_after);
            expect(total_after - total_before).toBe(5);
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    

    // POST - 200 ActualTotalLoad_big_healthy.csv inserted, no batch
    /**
     * Big csv document with dummy data ({AreaName: '__TEST__')}). Contains 1000 records
     * it should return 200-ok and response body with files in record, files inserted, files in db
     * should be 1000,1000,db+1000. No batch is happening
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (ADMIN - ActualTotalLoad - big - healthy - no batch', async done => {
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(200)
            .attach('csv_file', source + "ActualTotalLoad_big_healthy.csv")
            .set({'x_observatory_auth': token2});  
            
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('totalRecordsInFile');
            expect(res.body).toHaveProperty('totalRecordsImported');
            expect(res.body).toHaveProperty('totalRecordsInDatabase');

            expect(res.body.totalRecordsInFile).toBe(1000);
            expect(res.body.totalRecordsImported).toBe(1000);
            expect(res.body.totalRecordsInDatabase).toBe(total_after);
            expect(total_after - total_before).toBe(1000);
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    


    // POST - 200 ActualTotalLoad_big_healthy.csv inserted, batch
    /**
     * Big csv document with dummy data ({AreaName: '__TEST__')}). Contains 1000 records
     * it should return 200-ok and response body with files in record, files inserted, files in db
     * should be 1000,1000,db+1000. No batch is happening
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SUPER - ActualTotalLoad - big - healthy - batch size 500', async done => {
        process.env.BATCH_SIZE = 500;
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(200)
            .attach('csv_file', source + "ActualTotalLoad_big_healthy.csv")
            .set({'x_observatory_auth': token});  
            
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('totalRecordsInFile');
            expect(res.body).toHaveProperty('totalRecordsImported');
            expect(res.body).toHaveProperty('totalRecordsInDatabase');

            expect(res.body.totalRecordsInFile).toBe(1000);
            expect(res.body.totalRecordsImported).toBe(1000);
            expect(res.body.totalRecordsInDatabase).toBe(total_after);
            expect(total_after - total_before).toBe(1000);
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------




    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // BAD REQUEST TESTS START

    // POST - 400 ActualTotalLoad_small_bad.csv inserted
    /**
     * Small csv document with bad format dummy data ({AreaName: '__TEST__')}). Contains 4 records
     * it should return 400-BR and response body with files in record, files inserted, files in db
     * Batch is happening with size of 2, the wrong format is on the second batch and therefore we 
     * should see an error response with 4, 2, db+2
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - ActualTotalLoad - small - BAD - batch size 2 - error in second batch)', async done => {
        process.env.BATCH_SIZE = 2;   // set the batch size
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(400)
            .attach('csv_file', source + "ActualTotalLoad_small_bad1.csv")
            .set({'x_observatory_auth': token});  
            
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toHaveProperty('totalRecordsInFile');
            expect(res.body.additional).toHaveProperty('totalRecordsImported');
            expect(res.body.additional).toHaveProperty('totalRecordsInDatabase');
            expect(res.body.additional).toHaveProperty('message');
            expect(res.body.additional).toHaveProperty('info');
            
            

            expect(res.body.additional.totalRecordsInFile).toBe(4);                    // 4 records in file - 1 is damaged
            expect(res.body.additional.totalRecordsImported).toBe(2);                  // first 2 are ok and batch size is 2
            expect(res.body.additional.totalRecordsInDatabase).toBe(total_after);      
            expect(res.body.additional.message).toBe('The insertion was not completed successfully. There was something wrong with the file uploaded');
            expect(res.body.additional.info).toBe('ValidationError: Id: Cast to Number failed for value "a" at path "Id"');

            expect(total_after - total_before).toBe(2);                                // 2 out of 4 should be imported
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    

    // POST - 400 ActualTotalLoad_small_bad.csv inserted
    /**
     * Small csv document with bad format dummy data ({AreaName: '__TEST__')}). Contains 4 records
     * it should return 400-BR and response body with files in record, files inserted, files in db
     * Batch is happening with size of 2, the wrong format is on the first batch and therefore we 
     * should see an error response with 4, 0, db
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - ActualTotalLoad - small - BAD - batch size 2 - error in first batch)', async done => {
        process.env.BATCH_SIZE = 2;   // set the batch size
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(400)
            .attach('csv_file', source + "ActualTotalLoad_small_bad2.csv")
            .set({'x_observatory_auth': token});  
            
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toHaveProperty('totalRecordsInFile');
            expect(res.body.additional).toHaveProperty('totalRecordsImported');
            expect(res.body.additional).toHaveProperty('totalRecordsInDatabase');
            expect(res.body.additional).toHaveProperty('message');
            expect(res.body.additional).toHaveProperty('info');
            
            

            expect(res.body.additional.totalRecordsInFile).toBe(4);                    // 4 records in file - 1 is damaged
            expect(res.body.additional.totalRecordsImported).toBe(0);                  // last 2 are ok and batch size is 2
            expect(res.body.additional.totalRecordsInDatabase).toBe(total_after);      
            expect(res.body.additional.message).toBe('The insertion was not completed successfully. There was something wrong with the file uploaded');
            expect(res.body.additional.info).toBe('ValidationError: Id: Cast to Number failed for value "a" at path "Id"');

            expect(total_after - total_before).toBe(0);                                // 0 out of 4 should be imported
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // POST - 400 bad.txt inserted
    /**
     * Bad type of file uploaded. Server should accept CSV files only. Should produce a 400
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (SUPER - bad.txt)', async done => {
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(400)
            .attach('csv_file', source + "bad.txt")
            .set({'x_observatory_auth': token});  
            
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Bad request');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(400);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('Only csv files are acceptable');
      
            expect(total_after - total_before).toBe(0);                                // Nothing should change
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************
    // POST - 401 no token
    /**
     * Attempt to upload without token
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (NO TOKEN - bad.txt)', async done => {
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(401)
            .attach('csv_file', source + "bad.txt")
            
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('You do not have a valid token');
      
            expect(total_after - total_before).toBe(0);                                // Nothing should change
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // POST - 401 not valid token (expired)
    /**
     * Attempt to upload with expired token
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (EXPIRED TOKEN - bad.txt)', async done => {
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(401)
            .attach('csv_file', source + "bad.txt")
            .set({'x_observatory_auth':token_exp})
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('You do not have a valid token');
      
            expect(total_after - total_before).toBe(0);                                // Nothing should change
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    
    // POST - 401 non admin user
    /**
     * Attempt to upload with user account < admin
     */
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTH (SIMPLE USER - bad.txt)', async done => {
        try{
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_before = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            const res = await request.post('/energy/api/Admin/ActualTotalLoad')
            .expect(401)
            .attach('csv_file', source + "bad.txt")
            .set({'x_observatory_auth':token1})
            console.log(res.body);
            
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            const total_after = await ActualTotalLoad.countDocuments();
            await mongoose.disconnect();

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Not authorized');

            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toBe(401);

            expect(res.body).toHaveProperty('additional');
            expect(res.body.additional).toBe('You need Administrator privileges to access this');
      
            expect(total_after - total_before).toBe(0);                                // Nothing should change
            

            done();
        
        }catch(err){done(err);}
    });        
    // ---------------------------------------------------------------------------------------------------------------------------




});

