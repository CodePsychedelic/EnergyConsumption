
const request = require('supertest')
const app = require('../../../../app');

const mongoose = require('mongoose');   // mongoose for mongoDB
mongoose.set('useCreateIndex', true);

// mongoose conneciton
mongoose.connect(
    'mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false',   // environmental variable for pw
    { useNewUrlParser: true , useUnifiedTopology: true }    // use new url parser and new monitoring
); 

describe('ActualTotalLoad endpoints', () => {
    const api_key_test = '1111-1111-1111';  // test api_key
    var token = '';
    
    // before the tests, do a login using test user 
    beforeEach(function(done) {
        
        request(app)
        .post('/energy/api/Users/ApiLogin')
        .send({ api_key: api_key_test })
        .end(function(err, res) {
            token = res.body.token; // get a token
            if(err) return done(err);
            else return done();
        });
            
    });

    afterEach((done) => {
        done();
    });

    
    // 1a - endpoint test for NO DATA - 403
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 403 - NO DATA with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-24?api_key='+api_key_test)    // there is no data for 24/01/2018
        .set({ 'X_OBSERVATORY_AUTH': token })
        .expect(403)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
                done();
            }else return done(err);
        })
                    
    });
    // ---------------------------------------------------------------------------------------------------------------------------


    // 1b - endpoint test for NO DATA - 403
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 403 - NOT DATA with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/month/2018-12?api_key='+api_key_test)    // there is no data for 12/2018
        .set({ 'X_OBSERVATORY_AUTH': token })
        .expect(403)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
                done();
            }else return done(err);
        })
                    
    });
    // ---------------------------------------------------------------------------------------------------------------------------


    // 1c - endpoint test for NO data - 403
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 403 - NOT AUTHORIZED with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/year/2019?api_key='+api_key_test)    // no data for 2019
        .set({ 'X_OBSERVATORY_AUTH': token })
        .expect(403)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
                done();
            }else return done(err);
        })
                    
    });
    // ---------------------------------------------------------------------------------------------------------------------------



});