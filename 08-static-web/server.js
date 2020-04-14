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

function webServer(req, res) {
    let baseUri = url.parse(req.url);
    let filePath = __dirname + (baseUri.pathname === '/' ? '/index.htm' : baseUri.pathname);

    // check if requested file is accessible or not
    fs.access(filePath, fs.F_OK, error => {
        if (!error) {
            // Read and serve the file
            fs.readFile(filePath, (error, content) => {
                if (!error) {
                    console.log('Serving: ', filePath);
                    // Resolve the content type
                    let contentType = mimes[path.extname(filePath)]; //mimes['.css'] === 'text/css'
                    // Serve the file from the buffer
                    res.writeHead(200, {'Content-type': contentType});
                    res.end(content, 'utf-8');
                } else {
                    // Serve the 500
                    res.writeHead(500);
                    res.end('The server could not read the file requested.')
                }
            })
        } else {
            // Serve a 404
            res.writeHead(404);
            res.end('Content Not Found');
        }
    });
}

http.createServer(webServer).listen(8000, () => {
    console.log("webserver running in port 8000")
});
