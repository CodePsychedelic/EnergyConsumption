const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const messages = require('../messages');

exports.user_status = async (cli) => {
    
    // set up the headers. Check if token already exists.
    // If it exists, append it as x_observatory_auth
    // -------------------------------------------------------------------------------------
    let headers = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'};
    try{
        let data = fs.readFileSync(process.env.TOKEN);
        headers.x_observatory_auth = data.toString();
    }catch(err){
        return messages.AUTH_ERROR;
        
    }
    // -------------------------------------------------------------------------------------
    
    // user status request
    // -------------------------------------------------------------------------------------
    try{
        let response = await axios.get('http://localhost:8765/energy/api/Admin/users/'+cli.userstatus, {headers:headers})
        return response.data;
    }catch(err){
        if(err.response !== undefined) return err.response.data;
        else {
            return {
                code: err.code,
                no: err.errno,
                address: err.address
            }
        }
    }
    
    // -------------------------------------------------------------------------------------
}