const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const messages = require('../messages');

exports.upload = async (cli) => {
if(cli.newdata !== 'ActualTotalLoad' && cli.newdata !== 'DayAheadTotalLoadForecast' && cli.newdata !== 'AggregatedGenerationPerType'){
    console.log(messages.NEW_DATA_ERROR);
    return;
}

if(cli.source === undefined || cli.source.match(/\.csv$/) === null){
    console.log(messages.SOURCE_ERROR);
    return;
}


const path = './files/' + cli.source;



// set up the headers. Check if token already exists.
// If it exists, append it as x_observatory_auth
// -------------------------------------------------------------------------------------
let token = null;
try{
    token = fs.readFileSync('./softeng19bAPI.token');
    token = token.toString();
}catch(err){
    console.log(messages.AUTH_ERROR);
    return;
}

let file = null;
try{
    file = fs.createReadStream(path);
}catch(err){
    //console.log(err);
    console.log(messages.FILE_NOT_FOUND);
    return;
}

// http://localhost:8765/energy/api/Admin/ActualTotalLoad

let fdata = new FormData();

fdata.append('csv_file', file);

//'Content-Type: multipart/form-data; boundary=--------------------------545202795147331163691976\r\n'

//let str = 'Content-Type: multipart/form-data; boundary=' + fdata.getBoundary();
let headers = fdata.getHeaders(); //{str};
headers.x_observatory_auth = token;
console.log(headers);


try{
    let response = await axios.post( 'http://localhost:8765/energy/api/Admin/' + cli.newdata,
        fdata,
        {headers:headers, maxContentLength: Infinity, maxBodyLength: Infinity}
    )
    return response.data;
}catch(err){
    if(err.response !== undefined) return err.response.data;
    else{
        return {
            code: err.code,
            no: err.errno,
            address: err.address
        };
    }
}

/*.then((response) => {
    console.log(response.data);
})
.catch(err => {
    if(err.response !== undefined) console.log(err.response.data)
    else {
        console.log(err.code);
        console.log(err.errno);
        console.log(err.address);
    }
});*/





}



