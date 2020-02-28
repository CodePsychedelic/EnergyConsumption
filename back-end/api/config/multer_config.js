const errors = require('../../errors/errors');
const multer = require('multer');

// MULTER -- storage information
// ---------------------------------------------------------------
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, process.env.UPLOADS);             // store to the uploads folder
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);        //
    }
});
// ---------------------------------------------------------------

// MULTER -- file filter -- ONLY CSV files will be accepted
// ---------------------------------------------------------------
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'text/csv'){
        cb(null, true);
    }else{
        // reject file
        let err = JSON.parse(JSON.stringify(errors.BAD_REQUEST));
        err.additional = "Only csv files are acceptable";
        cb(err, false);
    }
   
};
// ---------------------------------------------------------------

// MULTER -- create middleware for upload
// ---------------------------------------------------------------
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
// ---------------------------------------------------------------

