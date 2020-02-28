
const errors = require('../../../errors/errors');
const action = require('./AggregatedGenerationPerType_queries');

function isString(x){
    if(isNaN(Number(x))) return true;
    else return false;
}


// http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/AllTypes/PT60M/date/2018-01-04
// returns recorded generation values for day 04/01/2018 from aggregated generation per type document. (grouped by day)
// ================================================================================================================================================
exports.AggregatedGenerationPerType_date = (req, res, next) => {
    const areaname = req.params.areaname;
    const ptype = req.params.ptype;
    const rescode = req.params.rescode;
    const data_format = (req.query.format !== 'json' && req.query.format !== 'csv')? 'json':req.query.format;
    const date_str = req.params.date;

    console.log(areaname + " " + rescode + " " + date_str);
    console.log(date_str.length);
    
    // validation (bad request) check
    if(!isString(areaname)) {next(errors.BAD_REQUEST); return;}
    if(!isString(ptype)) {next(errors.BAD_REQUEST); return;}
    if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M') {next(errors.BAD_REQUEST); return;}
    if(date_str.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) === null || date_str.length !== 10) {next(errors.BAD_REQUEST); return;}

    action.query(areaname, rescode, ptype, data_format, 'date', date_str.split("-"), res, next);

}
// ================================================================================================================================================

// http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/AllTypes/PT60M/month/2018-01
// returns recorded generation values for month 01/2018 from aggregated generation per type document. (grouped by month)
// ================================================================================================================================================
exports.AggregatedGenerationPerType_month = (req, res, next) => {
    const areaname = req.params.areaname;
    const ptype = req.params.ptype;
    const rescode = req.params.rescode;
    const data_format = (req.query.format !== 'json' && req.query.format !== 'csv')? 'json':req.query.format;
    const month_str = req.params.month;

    console.log(areaname + " " + rescode + " " + month_str);
    console.log(month_str.length); //7


    // validation (bad request) check
    if(!isString(areaname)) {next(errors.BAD_REQUEST); return;}
    if(!isString(ptype)) {next(errors.BAD_REQUEST); return;}
    if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M') {next(errors.BAD_REQUEST); return;}
    if(month_str.match(/([12]\d{3}-(0[1-9]|1[0-2]))/) === null || month_str.length !== 7) {next(errors.BAD_REQUEST); return;}

    action.query(areaname, rescode, ptype, data_format, 'month', month_str.split("-"), res, next);

};
// ================================================================================================================================================

// http://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/AllTypes/PT60M/month/2018
// returns recorded generation values for year 2018 from aggregated generation per type document. (grouped by year)
// ================================================================================================================================================
exports.AggregatedGenerationPerType_year = (req, res, next) => {
    const areaname = req.params.areaname;
    const ptype = req.params.ptype;
    const rescode = req.params.rescode;
    const data_format = (req.query.format !== 'json' && req.query.format !== 'csv')? 'json':req.query.format;
    const year_str = req.params.year;

    console.log(areaname + " " + rescode + " " + year_str);
    console.log(year_str.length); //7


    // validation (bad request) check
    if(!isString(areaname)) {next(errors.BAD_REQUEST); return;}
    if(rescode !== 'PT60M' && rescode !== 'PT30M' && rescode !== 'PT15M') {next(errors.BAD_REQUEST); return;}
    if(year_str.match(/[12]\d{3}/) === null || year_str.length !== 4) {next(errors.BAD_REQUEST); return;}

    action.query(areaname, rescode, ptype, data_format, 'year', year_str, res, next);
    
};
// ================================================================================================================================================
