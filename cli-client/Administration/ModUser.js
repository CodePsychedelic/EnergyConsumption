const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const messages = require('../messages');

exports.mod_user = async (cli) => {
    if(cli.passw === undefined && cli.email === undefined && cli.quota === undefined) return messages.MOD_PARAMS;
    else{

        // input validation
        // -------------------------------------------------------------------------------------------------
        if(cli.email !== undefined && cli.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) === null){
            return messages.EMAIL_ERROR;
        }

        if(cli.quota !== undefined && isNaN(cli.quota)){
            return messages.QUOTA_ERROR;
        }

        if(cli.passw !== undefined && cli.passw.length < 3){
            return messages.PASSWD_ERROR;
        }
        // -------------------------------------------------------------------------------------------------





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

        let updateOps = {};
        if(cli.passw !== undefined) updateOps['passwd'] = cli.passw;
        if(cli.email !== undefined) updateOps['email'] = cli.email;
        if(cli.quota !== undefined) updateOps['quota'] = cli.quota;
    

        try{
            let response = await axios.put(
                'http://localhost:8765/energy/api/Admin/users/' + cli.moduser,
                qs.stringify(updateOps),
                {headers: headers}
            )
            return response.data;
        }catch(err){
            if(err.response !== undefined) return err.response.data;
            else {
                return{
                    code: err.code,
                    no: err.errno,
                    address: err.address
                };
            }
        }
/*
        axios({
            method: 'put',
            url: 'http://localhost:8765/energy/api/Admin/users/' + cli.moduser,
            headers: headers, 
            data: qs.stringify(updateOps)
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
        */
    }
}