'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');

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
        '/api/login':(req, res)=>{
            let body='';
            req.on('data', data=>{
                body+=data;
                if(body.length > 2097152){ // 2*1024*1024: 2Mb in bytes
                    res.writeHead(413, {'Content-type':'text/html'})
                    res.end("<h3>File exceeds 2MB limit</h3>", ()=>{
                        req.connection.destroy()
                    })
                }
            });
            req.on('end', ()=>{
                let params = qs.parse(body);
                console.log('userName:', params['username']);
                console.log('password:', params['password']);
                res.end();
            });
        }
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
