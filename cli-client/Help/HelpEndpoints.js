const axios = require('axios');



exports.hcheck = async (cli) => {
    try{
        const response = await axios.get('http://localhost:8765/energy/api/HealthCheck/');
        return response.data;
    }catch(err){
        return {
            code: err.code,
            no: err.errno,
            address: err.address
        };
    }
    
};


exports.reset = (cli) => {
    let url = 'http://localhost:8765/energy/api/Reset'
    if(cli.pop !== undefined && cli.pop.match(/([0123456789])/) !== null && (Number(cli.pop) === 1 || Number(cli.pop) === 2)){
        url = url + '?pop=' + cli.pop;
    }
    console.log(url);
    axios({
        method: 'POST',
        url: url,
        headers: {}, 
    })
    .then(response => console.log(response.data))
    .catch(err => {
        console.log(err.code);
        console.log(err.errno);
        console.log(err.address);
    });
};