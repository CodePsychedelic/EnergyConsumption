const errors = require('../../../errors/errors');

const ActualTotalLoad = require('../../models/ActualTotalLoad');
const DayAheadTotalLoadForecast = require('../../models/DayAheadTotalLoadForecast');
const AggregatedGenerationPerType = require('../../models/AggregatedGenerationPerType');

const action = require('./Upload_functions');

// data upload for files: ActualTotalLoad and DayAheadTotalLoadForecast 
exports.Load = (req, res, next) => {
    const data = req.body.data;
    const scope = req.params.areaname;
    const model = (scope === 'ActualTotalLoad')? ActualTotalLoad:DayAheadTotalLoadForecast;

    action.upload(data, model, res, next);
}

// data upload for file: AggregatedGenerationPerType 
exports.Gen = (req, res, next) => {
    const data = req.body.data;

    action.upload(data, AggregatedGenerationPerType, res, next);
}

