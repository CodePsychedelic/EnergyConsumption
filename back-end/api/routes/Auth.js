const express = require('express'); // express import
const router = express.Router();    // router creation ( routes handling, ... 

const Auth_controller = require('../controllers/Auth/Auth_controller');
const Help_controller = require('../controllers/Help/Help_controller');
const check_token = require('../middleware/check_token');
const db_conn = require('../middleware/db_connect');

// auth endpoints are here
router.post('/Login', db_conn, check_token.logged_out, Auth_controller.user_login);
router.post('/Logout', db_conn, check_token.logged_in, Auth_controller.user_logout);

// helper endpoints are here
router.get('/HealthCheck',db_conn, Help_controller.check_connection);
router.post('/Reset', db_conn, Help_controller.reset);

module.exports = router;