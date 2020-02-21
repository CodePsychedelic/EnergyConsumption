const express = require('express'); // import installed package express
const app = express();  // execute it
const morgan = require('morgan'); // morgan (logging)
const body_parser = require('body-parser'); // body parser for body parsing...

const mongoose = require('mongoose');
const errors = require('./errors/errors');

// route handlers
const actualtotalload_routes = require('./api/routes/ActualTotalLoad');
const aggregatedGen_routes = require('./api/routes/AggregatedGenerationPerType');
const dayaheadforecast_routes = require('./api/routes/DayAheadTotalLoadForecast');
const actualvsforecast_routes = require('./api/routes/ActualvsForecast');
const auth_routes = require('./api/routes/Auth');
const admin_routes = require('./api/routes/Admin');

//console.log(process.cwd());


// give access to /files/speccific_file for download csv files
app.use('/files', express.static('files')); 

// middlewares
// --------------------------------------------------------------------------
// logging - morgan in dev for development
app.use(morgan('dev')); // it creates the routes i have with a next() at the end to forward to the actual route. It is a middleware.

// body parser middleware
app.use(body_parser.urlencoded({extended: false}));                   // set simple urlencoded bodies
//app.use(body_parser.urlencoded({limit: '50mb', extended: true}));
//app.use(body_parser.json({limit: '250mb'}));                        // set json bodies

// --------------------------------------------------------------------------



// headers config for CORS - errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // allow any origin to have acess to our server
    
    // headers that the client can send
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // for initial OPTIONS method of browser, set a header with all the methods that
    // are allowed for our client and return 200 OK 
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    
    // also we need to include next() at the end for the request to be forwarded to 
    // our routes in case we did not have an OPTIONS request.
    next();
});



// routes config
// --------------------------------------------------------------------------
// only requests that match the regExp: /url will be handled
// by the urlRoutes handler.
/*
    /url: acceptable url
    urlRoutes: request handler
*/

const HOME = '/energy/api' || process.env.HOME;
app.use(HOME + '/ActualTotalLoad', actualtotalload_routes);
app.use(HOME + '/AggregatedGenerationPerType', aggregatedGen_routes);
app.use(HOME + '/DayAheadTotalLoadForecast', dayaheadforecast_routes);
app.use(HOME + '/ActualvsForecast', actualvsforecast_routes);
app.use(HOME + '/Admin',admin_routes);
app.use(HOME + '/', auth_routes);





// error handling. If our url did not match
// one of the upper regExps we will forward
// an error request to our error handler
app.use((req, res, next) => {
    next(errors.BAD_REQUEST);               // forward the request - forward the error
});

// the actual error handling (error requests forwarded from above
// or errors thrown from our code)
app.use((error, req, res, next) => {
    res.status(error.status || 500);    // set status accordingly - error code or 500 default one
    res.json({
        message: error.message,
        code: error.status,
        additional: error.additional
    });
    console.log(error);
    if(mongoose.connection.readyState === 1) mongoose.connection.close(); 
});
// --------------------------------------------------------------------------



// so it can be exported and used  
module.exports = app;