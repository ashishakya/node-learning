'use strict';

const http = require('http');
const url = require('url');

let routes = {
    'GET':{
        '/':(req, res)=>{
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end('<h1>Hello from router</h1>')
        },
        '/about':(req, res)=>{
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end('<h1>This is about page  </h1>')
        },
        '/api/info':(req, res)=>{
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(JSON.stringify(req.queryParams))
        }
    },
    'POST':{

    },
    'NA':(req, res)=>{
        res.writeHead(400);
        res.end('Content not found');
    }
};

function router(req, res){
    let baseUri = url.parse(req.url, true);
    let resolveRoute = routes[req.method][baseUri.pathname];
    if(resolveRoute!==undefined){
        req.queryParams = baseUri.query;
        resolveRoute(req, res);
    }else{
        routes['NA'](req, res)
    }
}
http.createServer(router).listen(8000, ()=>{
    console.log("Server running in port 8000");
});
