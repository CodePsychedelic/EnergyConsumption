const errors = require('../../../errors/errors');

const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const CsvReadableStream = require('csv-reader')
const fs = require('fs');
const mongoose = require('mongoose');

// Admin operation - user status
// =======================================================================================================================
exports.user_status = (req, res, next) => {
    const username = req.params.username;
    
    User.findOne({username: username}).then(user_doc => {
        if(user_doc === null){ 
            let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
            err.additional = "User not found";
            next(err);
        }
        else{
            res.status(200).json({
                username: username,
                email: user_doc.email,
                quota: user_doc.quota,
                role: user_doc.role
            });
            mongoose.connection.close();
        }
    }).catch(db_err => next(db_err));
}
// =======================================================================================================================





// Admin operation - add user
// =======================================================================================================================
exports.user_add = (req, res, next) => {
    const username = req.body.username;
    const passwd = req.body.passwd;
    const email = req.body.email;
    const quota = req.body.quota;
    const role = req.body.role || 'USER';

    // ERRORS and VALIDATIONS
    // -----------------------------------------------------------------------------------------------------
    // we need all option to insert user. If atleast 1 option is missing -> bad request
    if(username === undefined || passwd === undefined || email === undefined || quota === undefined) {
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = "You need to provide all options that are required, to create user (username, passwd, email, quota)";
        next(err);
        return;
    }
    // if you are creating an admin, you must be the SUPER admin, else you are not authorized
    if(role !== undefined && (role === 'ADMIN' || role === 'SUPER') && req.verified.role !== 'SUPER') {
        let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
        err.additional = "Only SUPER can create ADMIN or SUPER";
        next(err);
        return;
    }
    // -----------------------------------------------------------------------------------------------------

    // debug messages
    console.log(username);
    console.log(passwd);
    console.log(email);
    console.log(quota);
    console.log(role);
    


    // check if user exists
    //{ $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }
    User.findOne({ $or: [{username: username}, {email: email}] })
    .then(user => {
        if(user !== null) {
            let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
            err.additional = 'User specified by info provided already exists';
            next(err);
            return;
        }
        else{
            // if user does not exist, we can create one and return a response with username
            const hash = bcrypt.hashSync(passwd, 10);
    
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: username,
                passwd: hash,
                email: email,
                quota: quota,
                quota_limit: quota,
                role: role
            });
            
            // save the user to the db
            user.save().then(result => {
                res.status(200).json({
                    user_created: username
                });
                mongoose.connection.close();
                return;
            }).catch(validation_err => {
                let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                err.additional = validation_err.message;
                next(err);
                return;
            });
        }
    }).catch(db_err => {
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = db_err.message;
        next(db_err);
        return;
    });

}
// =======================================================================================================================

// Admin operation - MOD user
// =======================================================================================================================
exports.user_mod = (req, res, next) => {

    username = req.params.username;
    console.log(username);
    // check if user exists
    User.findOne({username: username})
    .then(async user_doc => {
        if(user_doc === null){ 
            // user not found
            let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
            err.additional = 'User not found';
            next(err);
            return;
        }
        else{
            if((user_doc.role === 'ADMIN' || user_doc.role === 'SUPER') && req.verified.role !== 'SUPER'){
                // only SUPER can mod admin, and itself
                let err = JSON.parse(JSON.stringify(errors.NOT_AUTHORIZED));
                err.additional = 'Only SUPER can mod ADMIN or SUPER';
                next(err);
                return;
            }else{
                
                //console.log(req.body);
                let updateOps = {};
                if(req.body.passwd !== undefined) updateOps.passwd = bcrypt.hashSync(req.body.passwd, 10);
                if(req.body.email !== undefined) updateOps.email = req.body.email;
                if(req.body.quota !== undefined) updateOps.quota = updateOps.quota_limit = req.body.quota;
        
                
                // ERRORS and VALIDATIONS
                // -----------------------------------------------------------------------------------------------
                // if no option is specified for udpate, bad request
                if(updateOps.passwd === undefined && updateOps.email === undefined && updateOps.quota === undefined){ 
                    let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                    err.additional = "Need to speciffy at least 1 option to update";
                    next(err);
                    return;
                }
                // if we are editing an admin user, we cannot change the quota
                if((user_doc.role === 'ADMIN' || user_doc.role === 'SUPER') && req.body.quota !== undefined) {
                    let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                    err.additional = "Quota cannot be changed on admin OR super user"
                    next(err);
                    return;
                }

                // if email is set for mod, it needs to be a valid email
                if(updateOps.email !== undefined && updateOps.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) === null){
                    let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                    err.additional = "Email provided is not a valid email: " + updateOps.email
                    next(err);
                    return; 
                }

                // if email is set for mod, check for duplicate
                if(updateOps.email !== undefined){
                    let existing = await User.findOne({email: updateOps.email});
                    if(existing !== null){
                        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                        err.additional = 'Email provided already exists';
                        next(err);
                        return;
                    }
                }

                // -----------------------------------------------------------------------------------------------
                
                // update user - at least 1 option
                // ---------------------------------------------------------
                User.updateOne(
                    { username: username },     // update user with given username
                    { $set: updateOps }         // using updateOps
                ).exec().then(() => {
                    // if update worked, show the updated user json object
                    // --------------------------------------------
                    User.findOne({username: username})
                    .then(updated_user_doc => {
                        res.status(200).json(
                            updated_user_doc
                        );
                        mongoose.connection.close();
                        return;
                    })
                    .catch(db_err => {
                        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                        err.additional = db_err.message;
                        next(err);    
                        return;
                    })
                    // --------------------------------------------

                }).catch(validation_err => {
                    let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                    err.additional = validation_err.message;
                    next(err);
                    return;
                });
                // ---------------------------------------------------------
            }
        }
    })
    .catch(validation_err => {
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = validation_err.message;
        next(err);
        return;
    })
    
}
// =======================================================================================================================

// Admin operation - File Upload
// =======================================================================================================================
exports.file_upload = async (req, res, next) => {
    
    // model import
    // -----------------------------------------------------------------------------------------------------------------------------
    let model = null;
    if(req.params.areaname === 'ActualTotalLoad') model = require('../../models/ActualTotalLoad');
    else if(req.params.areaname === 'DayAheadTotalLoadForecast') model = require('../../models/DayAheadTotalLoadForecast');
    else model = require('../../models/AggregatedGenerationPerType');
    // -----------------------------------------------------------------------------------------------------------------------------

    // get count before insertion
    const count_before = await model.countDocuments();
    


    // read from csv
    // -----------------------------------------------------------------------------------------------------------------------------
    const inputStream = fs.createReadStream(process.env.UPLOADS + req.file.originalname, 'utf8');

    // array to hold the rows we read from csv file
    var rows = [];


    inputStream
        .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, delimiter:';' }))
        .on('data', function (row) {
            rows.push(row); // append row
        })
        .on('end', async function () {
                   
            const fields = rows[0]; // get fields array
            var data = [];          // data will be the json array for the request
            var temp = [];
            var k=0, l=0;
            var row;                // row json object to set foreach row read
            for(var i=1; i<rows.length; i++){
                row = {};
                for(var j=0; j<fields.length; j++){
                    row[fields[j]] = rows[i][j];    // create a field:value record foreach field
                }
                temp.push(row); // and save
                l++;
                if(l === Number(process.env.BATCH_SIZE) || i === rows.length - 1){
                    data[k] = temp.slice();
                    temp = [];
                    l=0;
                    k++;
                }
            }
            
           

            // step by step upload, to avoid heap crush for big files
            // we are using multiple requests of k-sized json arrays, and wait
            // foreach request. Definately slower, but trustworthy
            // ###########################################################################################################
            const csv_len = rows.length-1;
            for(var i=0; i<data.length; i++){
                try{
                    await model.insertMany(data[i]);
                }catch(db_err){
                    // error in insertion. Generate a report and a bad request error
                    // -----------------------------------------------------
                    const curr_count = await model.countDocuments();
                    const total_insertions = curr_count - count_before;
                    const report = {
                        totalRecordsInFile: csv_len,
                        totalRecordsImported: total_insertions,
                        totalRecordsInDatabase: curr_count,
                        message: "The insertion was not completed successfully. There was something wrong with the file uploaded",
                        info: db_err.toString()
                    }
                    let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
                    err.additional = report;
                    next(err);
                    // -----------------------------------------------------
                    return;
                }
                    
            }

               
            
            // ###########################################################################################################

            // insertion with no error - generate report
            // ---------------------------------------------------
            const curr_count = await model.countDocuments();
            const total_insertions = curr_count - count_before;

            const report = {
                totalRecordsInFile: csv_len,
                totalRecordsImported: total_insertions,
                totalRecordsInDatabase: curr_count
            }

            res.status(200).json(report);
            mongoose.connection.close(); 
            // ---------------------------------------------------
        });
    
}
// =======================================================================================================================