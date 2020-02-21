
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
    const api_key_test = '3333-3333-3333';  // test api_key - user that has 1 quota
    const bad_api_key_test = '2222-2222-2222';  // bad api_key - user that has 0 quota
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


    // 1a - endpoint test for NOT AUTHORIZED - 401 (without api key)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTHORIZED with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04')    // no api key
        .set({ 'X_OBSERVATORY_AUTH': token })
        .expect(401)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
                done();
            }else return done(err);
        })
                    
    });
    // ---------------------------------------------------------------------------------------------------------------------------

    
    // 1a - endpoint test for NOT AUTHORIZED - 401 (without token)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTHORIZED with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?api_key=' + api_key_test)
        // no headers with jwt set
        .expect(401)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
                done();
            }else return done(err);
        })
                    
    });
    // ---------------------------------------------------------------------------------------------------------------------------


    // 1a - endpoint test for NOT AUTHORIZED - 401 (api_key !== jwt token)
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 401 - NOT AUTHORIZED with code and message', done => {
        
        request(app)
        .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?api_key=' + bad_api_key_test)    // api key for 0 quota (user with 0 quota wants to steal quota)
        .set({ 'X_OBSERVATORY_AUTH': token })   // token for non zero quota
        .expect(401)
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