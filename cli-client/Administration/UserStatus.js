const axios = require('axios');
const fs = require('fs');
const qs = require('qs');

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
        console.log('No token found, please login');
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
    .catch(err => console.log(err.response.data));
    // -------------------------------------------------------------------------------------
}