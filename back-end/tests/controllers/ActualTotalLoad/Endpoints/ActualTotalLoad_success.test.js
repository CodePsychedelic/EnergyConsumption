const request = require('supertest')
const app = require('../../../../app');
const qs = require('qs');
/*
const mongoose = require('mongoose');   // mongoose for mongoDB
mongoose.set('useCreateIndex', true);

// mongoose conneciton
mongoose.connect(
    'mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false',   // environmental variable for pw
    { useNewUrlParser: true , useUnifiedTopology: true }    // use new url parser and new monitoring
); 
*/


    describe('ActualTotalLoad endpoints', () => {
        //const api_key_test = '1111-1111-1111';  // test api_key
        let token = '';
        

        // before the tests, do a login using test user 
        beforeAll(function(done){
            // set environment variables (test)
            process.env.URL = "http://localhost:8765";
            process.env.PORT = "8765";
            process.env.HOME = "/energy/api";
            process.env.JWT_KEY = "secret";
            process.env.MONGO_CONNECT = "mongodb://localhost:27017/softeng_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false" 
            
            // login with correct credentials
            request(app)
            .post(process.env.URL + process.env.HOME + '/Admin/users')
            .send(qs.stringify({username: 'admin', passw: '321nimda'}))
            .set({'Content-Type': 'application/x-www-form-urlencoded'})
            .expect(200)
            .end((err, res) => {
                if(!err){
                    expect(res.body).toHaveProperty('token');
                    token = res.body.token;
                    console.log(token);
                    done();
                }else{
                    return done(error);
                }
            })
            
        });
        
        /*beforeEach(function(done) {
            request(app)
            .post('/energy/api/Users/ApiLogin')
            .send({ api_key: api_key_test })
            .end(function(err, res) {
                token = res.body.token; // get a token
                done();
            });
                
        });
        */
        afterEach((done) => {
            done();
        });


        
        // 1a - 1c successful requests
        // =========================================================================================================================================================
        // 1a - endpoint test for successful request (user authentication)
        // ---------------------------------------------------------------------------------------------------------------------------
        it('Should create 200 OK with json msg', done => {
           
            request(app)
            .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04')
            .set({ 'X_OBSERVATORY_AUTH': token })
            .expect(200)
            .end((err, res) => {
                if(!err){
                    expect(res.body).toHaveProperty('count');
                    expect(res.body).toHaveProperty('results');
                    done();
                }else return done(error);
            })
                       
        });
        // ---------------------------------------------------------------------------------------------------------------------------

});