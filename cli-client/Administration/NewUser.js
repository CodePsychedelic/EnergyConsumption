const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
exports.new_user = (cli) => {
    if(cli.passw === undefined || cli.email === undefined || cli.quota === undefined) console.log('Required parameters are missing. We need --passw, --email, --quota');
    else{
        // input validation
        // -------------------------------------------------------------------------------------------------
        if(cli.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) === null){
            console.log('Invalid email address');
            return;
        }

        if(isNaN(cli.quota)){
            console.log('Quota needs to be numeric');
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
            console.log('No token found, please login');
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
        .catch(err => console.log(err.response.data));
        // -------------------------------------------------------------------------------------
    }
}