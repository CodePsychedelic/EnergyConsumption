const fs = require('fs');
const mongoose = require('mongoose');
module.exports = {
    generateResponse: function (documents,data_format,responses,path,data,res){
        //create a new json array of required data
        var docs = documents.map(document => {
            return responses.generateResponse_json(data,document);
        }); 

        // json data format
        // -----------------------------------------------
        if(data_format === 'json'){
            res.status(200).json({
                count: documents.length,
                results: docs
            });
            mongoose.connection.close();
        }
        // -----------------------------------------------

        // csv data format
        // -----------------------------------------------
        else if(data_format === 'csv'){
            
            responses.generateResponse_csv(docs,path).then(async () => {
                
                // download and delete file
                res.status(200).download(path, err => {
                    if(err) next(err);
                    else fs.unlinkSync(path);
                });
               
                mongoose.connection.close();
                
            });
        }
        // -----------------------------------------------
    }
};
