const cli = require('../../cli');


     

describe('CLI parser test', () => {
    let originalLog = null;
    let outputData = "";

    beforeEach(function(done){
        process.env.RUN = 'TEST';
        originalLog = console.log;                          // store the original console log function
        outputData = "";                                    // outputData buffer
        storeLog = inputs => (outputData += inputs);      // make a custom storeLog that appends input to our buffer
        console["log"] = jest.fn(storeLog);                     // and use it as console.log
        done();
    })
    
    afterEach(function(done){
        console.log = originalLog;
        done();
    });

    // SCOPE = HC | RESET
    // ------------------------------------------------------------------------------------
    it('HealthCheck should log "health"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','HealthCheck']);
        
        expect(outputData).toBe('health');
       
        done();    
    });
    
    it('Reset should log "reset"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','Reset']);
        
        expect(outputData).toBe('reset');
       
        done();    
    });
    // ------------------------------------------------------------------------------------
    // SCOPE = LOGIN | LOGOUT
    it('Login should log "login"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','Login']);
        
        expect(outputData).toBe('login');
       
        done();    
    });

    it('Logout should log "logout"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','Logout']);
        
        expect(outputData).toBe('logout');
       
        done();    
    });
    // ------------------------------------------------------------------------------------

    // SCOPE = ADMIN
    // ------------------------------------------------------------------------------------
    it('Admin - newuser should log "newuser"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','Admin','--newuser','xxx']);
        
        expect(outputData).toBe('newuser');

        cli.newuser = undefined;
       
        done();    
    });

    it('Admin - moduser should log "moduser"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','Admin','--moduser','xxx']);
        
        expect(outputData).toBe('moduser');
       
        cli.moduser = undefined;

        done();    
    });


    it('Admin - newdata should log "upload"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','Admin','--newdata','xxx']);
        
        expect(outputData).toBe('upload');

        cli.newdata = undefined;

        done();    
    });
    // ------------------------------------------------------------------------------------
    // SCOPE = LOAD
    it('ActualTotalLoad - should log "Actual"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','ActualTotalLoad']);
        
        expect(outputData).toBe('Actual');

        done();    
    });

    it('DayAheadTotalLoadForecast - should log "DayAhead"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','DayAheadTotalLoadForecast']);
        
        expect(outputData).toBe('DayAhead');

        done();    
    });

    it('ActualvsForecast - should log "ActualvsForecast"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','ActualvsForecast']);
        
        expect(outputData).toBe('ActualvsForecast');

        done();    
    });

    // ------------------------------------------------------------------------------------
    // SCOPE = Aggregated
    it('AggregatedGenerationPerType - should log "Aggregated"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','AggregatedGenerationPerType']);
        
        expect(outputData).toBe('Aggregated');

        done();    
    });


    // ------------------------------------------------------------------------------------
    // SCOPE = Unknown command
    it('Unknown command - should log "USAGE MESSAGE"', async (done) => {
        
        cli.parse(['exe','file','SCOPE','ASDF']);
        
        expect(outputData).toBe('USAGE MESSAGE');

        done();    
    });

})