const app = require('../../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const fs = require('fs');
const qs = require('qs');

// need mongoose and User model
const mongoose = require('mongoose');
const User = require('../../../api/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csvs = require('csv-string');

const Blacklist = require('../../../api/models/BlackListedToken');
const DayAheadTotalLoadForecast = require('../../../api/models/DayAheadTotalLoadForecast');

// /energy/api/ActualTotalLoad/.. ENDPOINT
// ================================================================================================================================================
describe('GET /energy/api/DayAheadTotalLoadForecast/../month/YYYY-MM', () => {
    let token = '';         // admin token
    let token1 = '';        // zero quota token
    let token2 = '';        // refresh quota token
    let token_exp = '';     // time expired token
    let token_log = '';     // blacklisted token

    // before start, setup some environmental variables
    beforeAll(async function(done){
        // set environment variables (test)
        process.env.URL = "http://localhost:8765";
        process.env.PORT = "8765";
        process.env.HOME = "/energy/api";
        process.env.JWT_KEY = "secret";
        process.env.MONGO_CONNECT = "mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false" 
        process.env.DOWNLOADS = './tests/controllers_v1.1/';
        try{
            mongoose.set('useCreateIndex', true);
            await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
            await User.deleteMany({username: {$regex: 'test'}});
            await User.deleteOne({username: 'admin'});
            await Blacklist.deleteMany({});
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


            
            // VALID USER TOKEN - QUOTA REFRESH
            // ---------------------------------------------
            token2 = jwt.sign({
                username: 'test2',
                email: 'test2@gmail.com',
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

            // BLACKLISTED USER TOKEN
            // ---------------------------------------------
            token_log = jwt.sign({
                username: 'test3',
                email: 'test3@gmail.com',
                role: 'USER'
            }, 

            process.env.JWT_KEY || 'secret',
            {
                expiresIn: "2h"
            });
            // ---------------------------------------------


            // admin + insert one user with 0 quota and one user with last refresh yesterday + blacklisted user
            // ############################################################################# 
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


            let date1 = new Date();
            date1.setDate(date1.getDate() + 1);

            // USER FOR OUT OF QUOTA ERROR
            let user1 = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'test1',
                passwd: bcrypt.hashSync('123',10),
                email: 'test1@gmail.com',
                quota: 1,           // for test with user call (200 ok)
                quota_limit: 0,
                role: 'USER',
                last_refresh: date1  // refresh will be tommorow, so no fail in worst case   
            });

            date2 = new Date();
            date2.setDate(date2.getDate() - 1);

            // USER FOR QUOTA REFRESH CHECK
            let user2 = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'test2',
                passwd: bcrypt.hashSync('123',10),
                email: 'test2@gmail.com',
                quota: 0,
                quota_limit: 1,
                role: 'USER',
                last_refresh: date2
            });

            // Blacklisted user
            let user3 = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'test3',
                passwd: bcrypt.hashSync('123',10),
                email: 'test3@gmail.com',
                quota: 0,
                quota_limit: 1,
                role: 'USER'
            });


            // #############################################################################
        
            await admin.save();
            await user1.save();
            await user2.save();
            await user3.save(); 

            let bl = new Blacklist({
                _id: new mongoose.Types.ObjectId(),
                Token: token_log,
                expAt: date1
            });
            await bl.save();
            await mongoose.disconnect();


       

            done();

        }catch(err){
            done(err);
            process.exit(1);
        }
   
        
    });


    // GET - 200 ok by admin
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (ADMIN)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(200)
        .end(async (err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('count');
                expect(res.body.count).toBe(10);

                expect(res.body).toHaveProperty('results');
                expect(res.body.results.length).toBe(10);

                await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });

                for(i=0; i<10; i++){
                    // what should the results contain (specs V1.1)
                    // ------------------------------------------------------------------------
                    expect(res.body.results[i]).toHaveProperty('Source');
                    expect(res.body.results[i]).toHaveProperty('Dataset');
                    expect(res.body.results[i]).toHaveProperty('AreaName');
                    expect(res.body.results[i]).toHaveProperty('AreaTypeCode');
                    expect(res.body.results[i]).toHaveProperty('MapCode');
                    expect(res.body.results[i]).toHaveProperty('ResolutionCode');
                    expect(res.body.results[i]).toHaveProperty('Year');
                    expect(res.body.results[i]).toHaveProperty('Month');
                    expect(res.body.results[i]).toHaveProperty('Day');
                    expect(res.body.results[i]).toHaveProperty('DayAheadTotalLoadForecastByDayValue');
                    // ------------------------------------------------------------------------

                    // values 
                    // ------------------------------------------------------------------------
                    expect(res.body.results[i].Source).toBe('entso-e');
                    expect(res.body.results[i].Dataset).toBe('DayAheadTotalLoadForecast');
                    expect(res.body.results[i].AreaName).toBe('Greece');
                    expect(res.body.results[i].AreaTypeCode).toBe('CTY');
                    expect(res.body.results[i].MapCode).toBe('GR');
                    expect(res.body.results[i].ResolutionCode).toBe('PT60M');
                    expect(res.body.results[i].Year).toBe(2018);
                    expect(res.body.results[i].Month).toBe(1);
                    expect(res.body.results[i].Day).toBe(i+1);
                    
                    // get the day group value from database
                    let r = await DayAheadTotalLoadForecast.aggregate([
                        { $match: {"AreaName": 'Greece', "Year": 2018, "Month": 1, "Day": i+1, "ResolutionCodeId": 2} },
                        
                        { $group: { _id: {Year:"$Year",Month:"$Month",Day:"$Day"}, total: { $sum: "$TotalLoadValue" }, count: {$sum: 1} } },
                        
                        { $sort : { _id:1 } }
            
                    ]);
                    expect(res.body.results[i].DayAheadTotalLoadForecastByDayValue).toBe(r[0].total);
                    // ------------------------------------------------------------------------
                    
                }
                mongoose.disconnect();


                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


     // GET - 200 ok by admin
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (ADMIN)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01?format=csv')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(200)
        .end(async (err, res) => {
            if(!err){


             // check the file unlink feature
             const files = fs.readdirSync(process.env.DOWNLOADS + '/DayAheadTotalLoadForecast');
             expect(files.length).toBe(3);
             

             // check if response is of type text/csv
             expect(res).toHaveProperty('type');
             expect(res.type).toBe('text/csv');
             
             // if it is, parse the csv and check fields
             try{
                let data = csvs.parse(res.text);
                expect(data.length).toBe(11);
                
                // HEADERS OF CSV FILE
                let fields = data[0];
                expect(fields[0]).toBe('Source');
                expect(fields[1]).toBe('Dataset');
                expect(fields[2]).toBe('AreaName');
                expect(fields[3]).toBe('AreaTypeCode');
                expect(fields[4]).toBe('MapCode');
                expect(fields[5]).toBe('ResolutionCode');
                expect(fields[6]).toBe('Year');
                expect(fields[7]).toBe('Month');
                expect(fields[8]).toBe('Day');
                expect(fields[9]).toBe('DayAheadTotalLoadForecastByDayValue');
            

                // DATA ROWS OF CSV FILE
                await mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
                for(var i=1; i<11; i++){
                    let row = data[i];
                    
                    expect(row[0]).toBe('entso-e');
                    expect(row[1]).toBe('DayAheadTotalLoadForecast');
                    expect(row[2]).toBe('Greece');
                    expect(row[3]).toBe('CTY');
                    expect(row[4]).toBe('GR');
                    expect(row[5]).toBe('PT60M');
                    expect(row[6]).toBe('2018');
                    expect(row[7]).toBe('1');
                    expect(row[8]).toBe((i).toString());
                    
                    // database
                    // get the day group value from database
                    let r = await DayAheadTotalLoadForecast.aggregate([
                        { $match: {"AreaName": 'Greece', "Year": 2018, "Month": 1, "Day": i, "ResolutionCodeId": 2} },
                        
                        { $group: { _id: {Year:"$Year",Month:"$Month",Day:"$Day"}, total: { $sum: "$TotalLoadValue" }, count: {$sum: 1} } },
                        
                        { $sort : { _id:1 } }
        
                    ]);               
                    
                    expect(r).not.toBe(null);
                    expect(row[9]).toBe(r[0].total.toString());
                
                   
                }
                mongoose.disconnect();
                done();
             }catch(err){
                 done(err);
             }  

            
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------




    // GET - 200 ok by simple user
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (SIMPLE USER WITH QUOTA > 0)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .set({'X_OBSERVATORY_AUTH':token1}) // simple user should become NO QUOTA user after this
        .expect(200)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('count');
                expect(res.body.count).toBe(10);

                expect(res.body).toHaveProperty('results');
                expect(res.body.results.length).toBe(10);
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 200 ok by REFRESHED USER
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - OK (REFRESHED USER)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .set({'X_OBSERVATORY_AUTH':token2})
        .expect(200)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('count');
                expect(res.body.count).toBe(10);

                expect(res.body).toHaveProperty('results');
                expect(res.body.results.length).toBe(10);
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 400 BAD_REQ(RESOLUTION) 
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST(RESOLUTION)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT40M/month/2018-01')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(400);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Bad request');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 400 BAD_REQ(DATE)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (DATE)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(400);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Bad request');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 400 BAD_REQ(FORM)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST (FORM)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/PT60M/month/2018-01')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(400);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Bad request');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 401 NOT_AUTH(TOKEN NOT SET)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTHORIZED (NO TOKEN SET)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .expect(401)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(401);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Not authorized');

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('You do not have a valid token');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 401 NOT_AUTH(INVALID TOKEN SET manually)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTHORIZED (MANUALLY SET TOKEN)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .expect(401)
        .set({'X_OBSERVATORY_AUTH':'123'})
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(401);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Not authorized');

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('You do not have a valid token');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 401 NOT_AUTH(INVALID TOKEN SET - TIME EXPIRATION)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTHORIZED (TIME EXPIRED TOKEN)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .expect(401)
        .set({'X_OBSERVATORY_AUTH':token_exp})
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(401);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Not authorized');

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('You do not have a valid token');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // GET - 401 NOT_AUTH(INVALID TOKEN SET - LOG OUT BLACKLIST)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTHORIZED (BLACKLISTED TOKEN)', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .expect(401)
        .set({'X_OBSERVATORY_AUTH':token_log}) 
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(401);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Not authorized');

                expect(res.body).toHaveProperty('additional');
                expect(res.body.additional).toBe('You do not have a valid token');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------


    // GET - 402 NO_QUOTA (QUOTA IS 0)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 402 - NO QUOTA', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01')
        .expect(402)
        .set({'X_OBSERVATORY_AUTH': token1})    // the moment of truth
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(402);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Out of quota');
                done();
            }else return done(err);
        })
    });
    // ---------------------------------------------------------------------------------------------------------------------------

    // GET - 403 NO_DATA /energy/api/ActualTotalLoad/Greece/PT30M/date/2018-01-04
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 403 - NO DATA', async done => {
        request.get('/energy/api/DayAheadTotalLoadForecast/Greece/PT30M/month/2018-01')
        .set({'X_OBSERVATORY_AUTH':token})
        .expect(403)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(403);

                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('No data');
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------



});

// ================================================================================================================================================

