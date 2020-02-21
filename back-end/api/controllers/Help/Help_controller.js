
const errors = require('../../../errors/errors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {populate} = require('./Help_functions/populate');


// if we made it here, we do have a healthy db connection
exports.check_connection = (req, res, next) => {
    res.status(200).json({
        status: "OK"
    });
    res.end();
    console.log({"status": "OK"});
    mongoose.connection.close();
    
}




// will clear all data, except SUPER admin
// Initiallize database with reference tables - pop 1
// Initiallize database with dummy data (?) - pop 2
exports.reset = async (req, res, next) => {
    console.log(req.query.pop);
    const pop = req.query.pop || 0;
    
    // user model
    const User = require('../../models/User');
    
    // data models
    const ActualTotalLoad = require('../../models/ActualTotalLoad');
    const DayAheadTotalLoadForecast = require('../../models/DayAheadTotalLoadForecast');
    const AggegatedGenerationPerType = require('../../models/AggregatedGenerationPerType');

    // ref models
    const AreaTypeCode = require('../../models/AreaTypeCode');
    const MapCode = require('../../models/MapCode');
    const ProductionType = require('../../models/ProductionType');
    const ResolutionCode = require('../../models/ResolutionCode');
    const AllocatedEICDetail = require('../../models/AllocatedEICDetail');


    // delete data
    await User.deleteMany();
    await ActualTotalLoad.deleteMany();
    await DayAheadTotalLoadForecast.deleteMany();
    await AggegatedGenerationPerType.deleteMany();
    await AreaTypeCode.deleteMany();
    await MapCode.deleteMany();
    await ProductionType.deleteMany();
    await ResolutionCode.deleteMany();
    await AllocatedEICDetail.deleteMany();

    // CREATE SUPER ADMIN
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: 'admin',
        passwd: bcrypt.hashSync('321nimda', 10),
        email: 'super@gmail.com',
        quota: -1,
        quota_limit: -1,
        role: 'SUPER'
    });
    


    // repopulate data tables and ref tables
    if(req.query.pop !== undefined && Number(pop) >= 1){
        let res;

        if(Number(pop) === 2){
            // data tables population
        
            res = await populate(ActualTotalLoad, './reset_data/data_tables/ActualTotalLoad-10days_fixed.csv')
            console.log(res);
            
            res = await populate(DayAheadTotalLoadForecast, './reset_data/data_tables/DayAheadTotalLoadForecast-10days_fixed.csv');
            console.log(res);

            res = await populate(AggegatedGenerationPerType, './reset_data/data_tables/AggregatedGenerationPerType-10days_fixed.csv');
            console.log(res);
        }

        // ref tables population
        res = await populate(AllocatedEICDetail, './reset_data/ref_tables/AllocatedEICDetail_fixed.csv');
        console.log(res);

        res = await populate(MapCode, './reset_data/ref_tables/MapCode_fixed.csv');
        console.log(res);

        res = await populate(AreaTypeCode, './reset_data/ref_tables/AreaTypeCode_fixed.csv');
        console.log(res);

        res = await populate(ProductionType, './reset_data/ref_tables/ProductionType_fixed.csv');
        console.log(res);

        res = await populate(ResolutionCode, './reset_data/ref_tables/ResolutionCode_fixed.csv');
        console.log(res);
    
    }

    // asked operation, create the default admin user
    try{
        await user.save();
        await res.status(200).json({
            status:"OK"
        });
        mongoose.connection.close();
    }catch(validation_err){
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = validation_err.message;
        next(err);
        return;
    }

};

