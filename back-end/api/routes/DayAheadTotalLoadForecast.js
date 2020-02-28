const express = require('express'); // express import
const router = express.Router();    // router creation ( routes handling, ... 

// middlewares that we need
const db_conn = require('../middleware/db_connect');
const {logged_in} = require('../middleware/check_token');
const check_quota = require('../middleware/check_quota');


const DayAheadTotalLoadForecast_controller = require('../controllers/DayAheadTotalLoadForecast/DayAheadTotalLoadForecast');


router.get('/:areaname/:rescode/date/:date', db_conn, logged_in, check_quota, DayAheadTotalLoadForecast_controller.DayAheadTotalLoadForecast_date);
router.get('/:areaname/:rescode/month/:month', db_conn, logged_in, check_quota, DayAheadTotalLoadForecast_controller.DayAheadTotalLoadForecast_month);
router.get('/:areaname/:rescode/year/:year', db_conn, logged_in, check_quota, DayAheadTotalLoadForecast_controller.DayAheadTotalLoadForecast_year);


module.exports = router;