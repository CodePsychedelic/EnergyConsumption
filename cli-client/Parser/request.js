const axios = require('axios');

exports.request = async(data, dataset) => {
    
    await axios({
        method: 'post',
        url: 'http://localhost:8765/energy/api/Upload/' + dataset +'/',
        headers: {}, 
        data: {
            data: data
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    })
    .then(response => console.log(response.data))
    .catch(err => console.log(err.response.data));
    
}