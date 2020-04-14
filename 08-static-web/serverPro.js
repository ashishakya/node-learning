'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimes = {
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
};

function fileAccess(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, error => {
            if (!error) {
                resolve(filePath);
            } else {
                reject(error);
            }
        });
    });
}

function fileReader(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, content) => {
            if (!error) {
                resolve(content);
            } else {
                reject(error);
            }
        })
    });
}

function webServer(req, res) {
    let baseUri = url.parse(req.url);
    let filePath = __dirname + (baseUri.pathname === '/' ? '/index.htm' : baseUri.pathname);
    let contentType = mimes[path.extname(filePath)]; //mimes['.css'] === 'text/css'
    // here the fileAccess return the file path which is automatically passed to fileReader as argument
    fileAccess(filePath)
        .then(fileReader)
        .then(content => {
            res.writeHead(200, {'Content-type': contentType});
            res.end(content, 'utf-8');
        })
        .catch(error => {
            res.writeHead(404);
            res.end(JSON.stringify(error));
        });
}

http.createServer(webServer).listen(8000, () => console.log("Web Server running in port 8000"));
