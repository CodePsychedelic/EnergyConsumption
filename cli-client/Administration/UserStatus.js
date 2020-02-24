const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const messages = require('../messages');

exports.user_status = (cli) => {
    console.log(cli.userstatus);
    
    // set up the headers. Check if token already exists.
    // If it exists, append it as x_observatory_auth
    // -------------------------------------------------------------------------------------
    let headers = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'};
    try{
        let data = fs.readFileSync('./softeng19bAPI.token');
        headers.x_observatory_auth = data.toString();
    }catch(err){
        console.log(messages.AUTH_ERROR);
        return;
    }
    // -------------------------------------------------------------------------------------

    // user status request
    // -------------------------------------------------------------------------------------
    axios({
        method: 'GET',
        url: 'http://localhost:8765/energy/api/Admin/users/' + cli.userstatus,
        headers: headers, 
    })
    .then(response => console.log(response.data))
    .catch(err => {
        if(err.response !== undefined) console.log(err.response.data)
        else {
            console.log(err.code);
            console.log(err.errno);
            console.log(err.address);
        }
    });
    // -------------------------------------------------------------------------------------
}