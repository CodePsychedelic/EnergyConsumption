// server setup
const http = require('http');           
const app = require('./app');           

const port = process.env.PORT || 3000;  
const server = http.createServer(app); 

// server timeout set to 0 (infinite) for big files upload
server.timeout = 0;
console.log(process.env.NODE_ENV);
server.listen(port);
