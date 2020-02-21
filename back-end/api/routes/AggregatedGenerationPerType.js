const express = require('express'); // express import
const router = express.Router();    // router creation ( routes handling, ... 


// middlewares that we need
const db_conn = require('../middleware/db_connect');
const {logged_in} = require('../middleware/check_token');
const check_quota = require('../middleware/check_quota');

const AggregatedGenerationPerDay_controller = require('../controllers/AggregatedGenerationPerType/AggregatedGenerationPerType');

// last error was -- i did not save the controller --> undefined reference
router.get('/:areaname/:ptype/:rescode/date/:date', db_conn, logged_in, check_quota, AggregatedGenerationPerDay_controller.AggregatedGenerationPerType_date);
router.get('/:areaname/:ptype/:rescode/month/:month', db_conn, logged_in, check_quota, AggregatedGenerationPerDay_controller.AggregatedGenerationPerType_month);
router.get('/:areaname/:ptype/:rescode/year/:year', db_conn, logged_in, check_quota, AggregatedGenerationPerDay_controller.AggregatedGenerationPerType_year);



module.exports = router;