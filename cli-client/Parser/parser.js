const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const axios = require('axios');
const req = require('./request');

exports.read_and_upload = async(file_name, dataset) => {
    const inputStream = fs.createReadStream(file_name, 'utf8');
    
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
            var row;                // row object to set foreach row read
            for(var i=1; i<rows.length; i++){
                row = {};
                for(var j=0; j<fields.length; j++){
                    row[fields[j]] = rows[i][j];    // field: value
                }
                data.push(row); // and save
            }
            
            // step by step upload, to avoid heap crush for big files
            // we are using multiple requests of k-sized json arrays, and wait
            // foreach request. Definately slower, but trustworthy
            // ----------------------------------------------------------------------
            var d=[]; var k=0;
            console.log(data.length);
            for(var i=0; i<data.length; i++){
                
                if(k == 50000 || i === data.length - 1){
                    await req.request(d, dataset);
                    d = [];
                    k = 0;
                    
                    
                }

                d.push(data[i]);
                k++;
            }
            // ----------------------------------------------------------------------
        });

    
    
}