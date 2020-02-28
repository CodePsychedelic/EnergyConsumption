const errors = require('../../../errors/errors');



exports.upload = function(data, model, res, next){
    if(data === undefined || !Array.isArray(data)){
        next(errors.BAD_REQUEST);
    }else{    
        model.insertMany(data).then(result => {
            res.status(200).json({
                status: "ok",
                message: "Data successfully uploaded"
            });
        }).catch(err => next(err));

    }
}