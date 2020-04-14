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

// reads the files in chunks inlike the fs.read which reads the whole content as once
function streamFile(filePath) {
    return new Promise((resolve, reject) => {
        let fileStream = fs.createReadStream(filePath);
        // fileStream emits an event
        fileStream.on('open', ()=>{
            resolve(fileStream);
        });
        fileStream.on('error', error=>{
            reject(error);
        })
    })
}

function webServer(req, res) {
    let baseUri = url.parse(req.url);
    let filePath = __dirname + (baseUri.pathname === '/' ? '/index.htm' : baseUri.pathname);
    let contentType = mimes[path.extname(filePath)]; //mimes['.css'] === 'text/css'
    // here the fileAccess return the file path which is automatically passed to fileReader as argument
    fileAccess(filePath)
        .then(streamFile)
        .then(fileStream => {
            res.writeHead(200, {'Content-type': contentType});
            fileStream.pipe(res);
            // res.end(content, 'utf-8');
        })
        .catch(error => {
            res.writeHead(404);
            res.end(JSON.stringify(error));
        });
}

http.createServer(webServer).listen(8000, () => console.log("Web Server running in port 8000"));
