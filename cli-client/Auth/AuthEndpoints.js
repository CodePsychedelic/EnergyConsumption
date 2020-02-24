const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const messages = require('../messages');
exports.login = async(cli) => {
    const username = cli.username;
    const passw = cli.passw;

    if(username === undefined || passw === undefined){
        console.log(messages.LOGIN_PARAMS);
        return;
    }


    // set up the headers. Check if token already exists.
    // If it exists, append it as x_observatory_auth
    // -------------------------------------------------------------------------------------
    let headers = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'};
    try{
        let data = fs.readFileSync('./softeng19bAPI.token');
        headers.x_observatory_auth = data.toString();
    }catch(err){
        console.log('Loging in..');
    }
    // -------------------------------------------------------------------------------------



    // login operation
    // ======================================================================================
    let login_response = null;
    try{

        // actual request
        login_response = await axios({
            method: 'POST',
            url: 'http://localhost:8765/energy/api/Login',
            headers: headers, 
            data: qs.stringify({
                username: username,
                passw: passw
            })
        });

        // save our token to ${HOME}/softeng19bAPI.token = ./softeng19bAPI.token
        fs.writeFile('./softeng19bAPI.token', login_response.data.token, err => {
            if(err) return console.log(err);
            console.log("ok");
        })
        

    }catch(err){
        if(err.response !== undefined){ 
            // api error - will have a response
            console.log(err.response.data);
            if(err.response.data.additional !== undefined && err.response.data.additional.verified !== undefined){
                console.log('Token expires at: ' + new Date(err.response.data.additional.verified.exp * 1000));
            }
        }else{
            // connection error
            console.log(err.code);
            console.log(err.errno);
            console.log(err.address);
        }
    }
    // ======================================================================================

}

exports.logout = async(cli) => {


    // check if file exists, and read its data. (the token)
    // logout request with the token (header) --> blacklist the token
    // unlink the file --> delete the token file    
    // ======================================================================================
    let headers = {};
    try{
        let data = fs.readFileSync('./softeng19bAPI.token');
        headers.x_observatory_auth = data.toString();
        
        // actual request
        logout_response = await axios({
            method: 'POST',
            url: 'http://localhost:8765/energy/api/Logout',
            headers: headers
        });
        console.log(logout_response.data);
        fs.unlinkSync('./softeng19bAPI.token');
        return;
    }catch(err){
        console.log('No token found');
        return;
    }
    // ======================================================================================

    
}