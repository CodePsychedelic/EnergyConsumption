const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const messages = require('../messages');

exports.new_user = async(cli) => {
    if(cli.passw === undefined || cli.email === undefined || cli.quota === undefined) console.log(messages.NEW_USER_PARAMS);
    else{
        // input validation
        // -------------------------------------------------------------------------------------------------
        if(cli.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) === null){
            return messages.EMAIL_ERROR
        }

        if(isNaN(cli.quota)){
            return messages.QUOTA_ERROR;
        }

        if(cli.passw.length < 3){
            return messages.PASSWD_ERROR;
        }
        // -------------------------------------------------------------------------------------------------


        // set up the headers. Check if token already exists.
        // If it exists, append it as x_observatory_auth
        // -------------------------------------------------------------------------------------
        let headers = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'};
        try{
            let data = fs.readFileSync('./softeng19bAPI.token');
            headers.x_observatory_auth = data.toString();
        }catch(err){
            return messages.AUTH_ERROR;
        }
        // -------------------------------------------------------------------------------------

        // request for add user
        // -------------------------------------------------------------------------------------
        
        try{
            let response = await axios.post(
                'http://localhost:8765/energy/api/Admin/users',
                qs.stringify({
                    "username": cli.newuser,
                    "passwd": cli.passw,
                    "email": cli.email,
                    "quota": Number(cli.quota)
                }),
                {headers: headers}
            );
            return response.data;
        }catch(err){
            if(err.response !== undefined) return err.response.data;
            else {
                return {
                    code: err.code,
                    no: err.errno,
                    address: err.address
                };
            }
        }

        // -------------------------------------------------------------------------------------
    }
}