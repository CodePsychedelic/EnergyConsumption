const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

exports.upload = (cli) => {
if(cli.newdata !== 'ActualTotalLoad' && cli.newdata !== 'DayAheadTotalLoadForecast' && cli.newdata !== 'AggregatedGenerationPerType'){
    console.log(cli.newdata);
    console.log('Accepted values for --newdata: ActualTotalLoad | DayAheadTotalLoadForecast | AggregatedGenerationPerType');
    return;
}

if(cli.source === undefined || cli.source.match(/\.csv$/) === null){
    console.log('You need to define the source csv file correctly, using --source');
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
    console.log('No token found, please login');
    return;
}

let file = null;
try{
    file = fs.createReadStream(path);
}catch(err){
    //console.log(err);
    console.log('The csv file speciffied, does not exist');
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



axios.post( 'http://localhost:8765/energy/api/Admin/' + cli.newdata,
    fdata,
    {headers:headers, maxContentLength: Infinity, maxBodyLength: Infinity}
).then((response) => {
    console.log(response.data);
})
.catch(err => {
    if(err.response !== undefined) console.log(err.response.data);
    else console.log(err);
});



}



