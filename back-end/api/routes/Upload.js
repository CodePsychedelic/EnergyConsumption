const express = require('express'); // express import
const router = express.Router();    // router creation ( routes handling, ... 
const Upload_controller = require('../controllers/Upload/Upload_controller');

router.post('/:areaname(ActualTotalLoad|DayAheadTotalLoadForecast)', Upload_controller.Load);
router.post('/AggregatedGenerationPerType', Upload_controller.Gen);

module.exports = router;