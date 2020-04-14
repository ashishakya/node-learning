'use strict';
const http = require('http');
http.createServer((req, res)=>{
    res.writeHead(200, {'Content-type':'text/html'});
    res.end("<h1>Hello NodeJs</h1>");
}).listen(8000, ()=>console.log('Server running in port 8000'));

