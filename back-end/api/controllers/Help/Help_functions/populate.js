const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const errors = require('../../../../errors/errors');

exports.populate = async (model, file) => {
    const inputStream = fs.createReadStream(file, 'utf8');
    let rows = [];
    
    let is = inputStream.pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, delimiter:';' }));
    

    // PROMISIFY the whole input stream so that it can be used with await
    // ------------------------------------------------------------------------------------------
    let wtf = new Promise((resolve, reject) => {
        is.on('data', function (row) {
            rows.push(row); // append row
        });
        
        is.on('end', async function () {
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
                if(l === 30000 || i === rows.length - 1){
                    data[k] = temp.slice();
                    temp = [];
                    l=0;
                    k++;
                }
            }
            
            //console.log(data);
            // step by step upload, to avoid heap crush for big files
            // we are using multiple requests of k-sized json arrays, and wait
            // foreach request. Definately slower, but trustworthy
            // ###########################################################################################################
            //var d=[]; var k=0; let fail = 0;
            let fail = 0;
            const csv_len = rows.length-1;
            for(var i=0; i<data.length; i++){
                try{
                    await model.insertMany(data[i]);
                }catch(db_err){
                    // error in insertion. Generate a report and a bad request error
                    // -----------------------------------------------------
                    const curr_count = await model.countDocuments();
                    const total_insertions = curr_count;
                    const report = {
                        collection: model.collection.name,
                        totalRecordsInFile: csv_len,
                        totalRecordsImported: total_insertions,
                        totalRecordsInDatabase: curr_count,
                        message: "The insertion was not completed successfully. There was something wrong with the file uploaded",
                        info: db_err.toString()
                    }
                    let err = errors.BAD_REQUEST;
                    err.additional = report;
                    fail = 1;
                    reject(err);
                    // -----------------------------------------------------
                    
                    break;
                }
                
            }

            
            
            // ###########################################################################################################
            
            if(fail === 0){
                // if not fail, we will generate a successful report and resolve
                const curr_count = await model.countDocuments();
                const total_insertions = curr_count - 0;

                const report = {
                    collection: model.collection.name,
                    totalRecordsInFile: csv_len,
                    totalRecordsImported: total_insertions,
                    totalRecordsInDatabase: curr_count
                }

                
                resolve(report);
            }
        });
    });
    // ------------------------------------------------------------------------------------------

    try{
        let res = await wtf;
        return res;
    }catch(wtf_err){
        return wtf_err;
    }
    
    

}


