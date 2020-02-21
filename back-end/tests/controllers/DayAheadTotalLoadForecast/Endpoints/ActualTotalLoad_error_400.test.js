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
            done();
        });
            
    });

    afterEach((done) => {
        done();
    });

    // ERROR replies 1a
    // =========================================================================================================================================================
    // 1a - endpoint test for BAD REQUEST - 400
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-?api_key=' + api_key_test)
        .set({ 'X_OBSERVATORY_AUTH': token })
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
                done();
            }else return done(err);
        })
                    
    });
    // ---------------------------------------------------------------------------------------------------------------------------

    // 1b - endpoint test for BAD REQUEST - 400
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/month/2018-1?api_key=' + api_key_test)
        .set({ 'X_OBSERVATORY_AUTH': token })
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
                done();
            }else return done(err);
        })
                    
    });
    // ---------------------------------------------------------------------------------------------------------------------------

    // 1c - endpoint test for BAD REQUEST - 400
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/year/201?api_key=' + api_key_test)
        .set({ 'X_OBSERVATORY_AUTH': token })
        .expect(400)
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