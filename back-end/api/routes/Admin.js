const express = require('express'); // express import
const router = express.Router();    // router creation ( routes handling, ... 

const Admin_controller = require('../controllers/Admin/Admin_controller');
const db_conn = require('../middleware/db_connect');
const {logged_in} = require('../middleware/check_token');
const check_admin = require('../middleware/check_admin');
const upload = require('../config/multer_config');


// user admin
// ---------------------------------------------------------------
router.post('/users', db_conn, logged_in, check_admin, Admin_controller.user_add);                // Admin add user operation
router.get('/users/:username', db_conn, logged_in, check_admin, Admin_controller.user_status);    // Admin userstatus operation
router.put('/users/:username', db_conn, logged_in, check_admin, Admin_controller.user_mod);       // Admin mod user operation

// Admin upload file operation -- look for a file using upload middleware (multer). The field name of the file will be csv_file (name from form)
router.post('/:areaname(ActualTotalLoad|AggregatedGenerationPerType|DayAheadTotalLoadForecast)', db_conn, logged_in, check_admin, upload.single('csv_file'), Admin_controller.file_upload);  
// ---------------------------------------------------------------

module.exports = router;