const axios = require('axios');



exports.hcheck = (cli) => {
    axios({
        method: 'GET',
        url: 'http://localhost:8765/energy/api/HealthCheck/',
        headers: {}, 
    })
    .then(response => console.log(response.data))
    .catch(err => console.log(err.response.data));
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
    .catch(err => console.log(err.response.data));
};