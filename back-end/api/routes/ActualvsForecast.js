const express = require('express'); // express import
const router = express.Router();    // router creation ( routes handling, ... 


// middlewares that we need
const db_conn = require('../middleware/db_connect');
const {logged_in} = require('../middleware/check_token');
const check_quota = require('../middleware/check_quota');



const ActualvsForecast_controller = require('../controllers/ActualvsForecast/ActualvsForecast_controller');

//router.get('/:areaname/:rescode/:year?/:month?/:day?', check_auth, ActualvsForecast_controller.ActualvsForecast_operations);

router.get('/:areaname/:rescode/date/:date', db_conn, logged_in, check_quota, ActualvsForecast_controller.ActualvsForecast_date);
router.get('/:areaname/:rescode/month/:month', db_conn, logged_in, check_quota, ActualvsForecast_controller.ActualvsForecast_month);
router.get('/:areaname/:rescode/year/:year', db_conn, logged_in, check_quota, ActualvsForecast_controller.ActualvsForecast_year);

module.exports = router;