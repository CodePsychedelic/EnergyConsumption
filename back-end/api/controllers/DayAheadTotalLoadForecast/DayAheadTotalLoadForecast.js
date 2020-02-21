const mongoose = require('mongoose');


const errors = require('../../../errors/errors');
const action = require('./DayAheadTotalLoadForecast_queries');

function isString(x){
    if(isNaN(Number(x))) return true;
    else return false;
}



// get http://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/date/2018-01-04
// returns recorded load values for day 04/01/2018 from dayahead doc. (grouped by day)
// ================================================================================================================================================
exports.DayAheadTotalLoadForecast_date = (req, res, next) => {
    const areaname = req.params.areaname;
    const rescode = req.params.rescode;
    const data_format = (req.query.format !== 'json' && req.query.format !== 'csv')? 'json':req.query.format;
    const date_str = req.params.date;

    console.log(areaname + " " + rescode + " " + date_str);
    console.log(date_str.length);
    
    // validation (bad request) check
    if(!isString(areaname)) {next(errors.BAD_REQUEST); return;}
    if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M') {next(errors.BAD_REQUEST); return;}
    if(date_str.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null || date_str.length !== 10) {next(errors.BAD_REQUEST); return;}

    action.query(areaname, rescode, data_format, 'date', date_str.split("-"), res, next);

}
// ================================================================================================================================================

// get http://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/month/2018-01
// returns recorded load values for month 01/2018 from dayahead doc (grouped by month)
// ================================================================================================================================================
exports.DayAheadTotalLoadForecast_month = (req, res, next) => {
    const areaname = req.params.areaname;
    const rescode = req.params.rescode;
    const data_format = (req.query.format !== 'json' && req.query.format !== 'csv')? 'json':req.query.format;
    const month_str = req.params.month;

    console.log(areaname + " " + rescode + " " + month_str);
    console.log(month_str.length); //7


    // validation (bad request) check
    if(!isString(areaname)) {next(errors.BAD_REQUEST); return;}
    if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M') {next(errors.BAD_REQUEST); return;}
    if(month_str.match(/([12]\d{3}-(0[1-9]|1[0-2]))/) === null || month_str.length !== 7) {next(errors.BAD_REQUEST); return;}


    action.query(areaname, rescode, data_format, 'month', month_str.split("-"), res, next);

}
// ================================================================================================================================================


// get http://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/year/2018
// returns recorded load values for year 2018 from dayahead doc. (grouped by year)
// ================================================================================================================================================
exports.DayAheadTotalLoadForecast_year = (req, res, next) => {
    const areaname = req.params.areaname;
    const rescode = req.params.rescode;
    const data_format = (req.query.format !== 'json' && req.query.format !== 'csv')? 'json':req.query.format;
    const year_str = req.params.year;

    console.log(areaname + " " + rescode + " " + year_str);
    console.log(year_str.length); //7


    // validation (bad request) check
    if(!isString(areaname)) {next(errors.BAD_REQUEST); return;}
    if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M') {next(errors.BAD_REQUEST); return;}
    if(year_str.match(/[12]\d{3}/) === null || year_str.length !== 4) {next(errors.BAD_REQUEST); return;}


    action.query(areaname, rescode, data_format, 'year', year_str, res, next);

}
// ================================================================================================================================================
