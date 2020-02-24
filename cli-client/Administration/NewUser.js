const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const messages = require('../messages');

exports.new_user = (cli) => {
    if(cli.passw === undefined || cli.email === undefined || cli.quota === undefined) console.log(messages.NEW_USER_PARAMS);
    else{
        // input validation
        // -------------------------------------------------------------------------------------------------
        if(cli.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) === null){
            console.log(messages.EMAIL_ERROR)
            return;
        }

        if(isNaN(cli.quota)){
            console.log(messages.QUOTA_ERROR);
            return;
        }

        if(cli.passw.length < 3){
            console.log(messages.PASSWD_ERROR);
            return;
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
            console.log(messages.AUTH_ERROR);
            return;
        }
        // -------------------------------------------------------------------------------------

        // request for add user
        // -------------------------------------------------------------------------------------
        axios({
            method: 'post',
            url: 'http://localhost:8765/energy/api/Admin/users',
            headers: headers, 
            data: qs.stringify({
                "username": cli.newuser,
                "passwd": cli.passw,
                "email": cli.email,
                "quota": Number(cli.quota)
            })
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
}