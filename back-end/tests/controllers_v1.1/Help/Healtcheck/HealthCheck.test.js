//const request = require('supertest')
//const app = require('../../../app');

const app = require('../../../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

// /energy/api/HealthCheck ENDPOINT - GET method
// ================================================================================================================================================
describe('GET /energy/api/HealthCheck', () => {

    // before start, setup some environmental variables
    beforeAll(function(done){
        // set environment variables (test)
        process.env.URL = "http://localhost:8765";
        process.env.PORT = "8765";
        process.env.HOME = "/energy/api";
        process.env.JWT_KEY = "secret";
        process.env.MONGO_CONNECT = "mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
        
        done();
    });
    
    
    // GET - 200 ok
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 200 - ok', async done => {
        request.get('/energy/api/HealthCheck')
        .expect(200)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('status');
                expect(res.body.status).toBe("OK");
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------
    
    // GET - BAD REQUEST
    // ---------------------------------------------------------------------------------------------------------------------------
    it('Should create 400 - BAD REQUEST', async done => {
        request.get('/energy/api/HealthChec')
        .expect(400)
        .end((err, res) => {
            if(!err){
                expect(res.body).toHaveProperty('code');
                expect(res.body.code).toBe(400);
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe("Bad request");
                done();
            }else return done(err);
        })
    });        
    // ---------------------------------------------------------------------------------------------------------------------------

});

// ================================================================================================================================================

