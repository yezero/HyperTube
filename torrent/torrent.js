const http = require('http');
const express = require('express');
const server = express();
const pirateBay = require('thepiratebay');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const path = require('path');
const Transcoder = require('./transcoder');

http.createServer(server).listen(3500, () => console.log("Server listening on http://localhost:3500"));

server.get('/pirate', (request, response) => {
    const title = request.query.title;
    const type = request.query.type;
    console.log("The title "+title);
    console.log("The type "+type);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Header', 'Origin, x-requested-with, Content-Type, Accept');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATH, DELETE, OPTIONS');
    callPirateBay(title, type, result => {
        if (result.status === false){
            console.log('Error on Piratebay');
            return response.status(500).json({
                title: 'failed',
                message: 'server error'
            });
        }
        console.log(result.torrent);
        response.status(201).json({
            title: 'success',
            magnet: result.torrent.magnetLink
        });
    });
});

server.get('/uri/**', (request, response) => {
    console.log('uri');
    console.log(request.url);
    const magnet = request.url.split('/')[2];
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Header', 'Origin, x-requested-with, Content-Type, Accept');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATH, DELETE, OPTIONS');
    theTorrentStream(magnet, response, request);
});

server.get('/', (request, response) => {
   response.end('Server running');
});

server.get('**', (request, response) => {
    console.log(request.url);
    response.end('404 Page Not found');
});

function callPirateBay(title, type, callback) {
    let opts;
    if (type == "movie"){
        opts = {
            category: 'Movies',
            orderBy: 'seeds',
            sortBy: 'desc'
        };
    }else{
        opts = {
            category: 'TV shows',
            orderBy: 'seeds',
            sortBy: 'desc'
        };
    }
    pirateBay.search(title, opts)
        .then(result => {
            console .log('found');
            callback({
                status: true,
                torrent: result[0]
            });
        })
        .catch(err => callback({
            status: false,
            error: err
        }));
}

function theTorrentStream(torrent, res, req) {
    console.log('torrent Stream');
    console.log(torrent);
    const engine = torrentStream(torrent);

    engine.on('ready', () => {
        console.log('engine reday');
        let videoFile = {
            length: 0
        };

        engine.files.forEach(file => {
            if (file.length > videoFile.length)
                videoFile = file;
        });
        console.log("This is the video : "+videoFile.name);
        fs.open(path.join(__dirname + '/movies/'+videoFile.name), 'w', (err, data) => {
            if (err){
                console.log('failed to create file');
                res.end('file creation failed');
            }else{
                const split = videoFile.name.split('.');
                if (split[split.length - 1] === 'mp4' || split[split.length - 1] === 'mp4'){
                    let range = [];
                    if (req.headers.range !== undefined){
                        range = req.headers.range.replace(/bytes=/, '').split('-');
                        range[0] = parseInt(range[0]);
                        if (range[1] === ''){
                            range[1] = videoFile.length;
                        }
                    }else{
                        range[0] = 0;
                        range[1] = videoFile.length;
                    }
                    res.status(206);
                    console.log('from r1: '+range[0]+' to r2: '+range[1]);
                    res.set('Content-Type', 'mp4');
                    res.set('Accept-Ranges', 'bytes');
                    res.set('Content-Length', range[1] - range[0]);
                    res.set('Content-Range', `bytes ${range[0]}-${range[1] - 1}/${videoFile.length}`);
                    videoFile.createReadStream({start: range[0], end: range[1]}).pipe(res);
                }else{
                    //res.status(206);
                    console.log('other stream');
                    const newStream = videoFile.createReadStream({start: 0, end: videoFile.length});
                    new Transcoder(newStream)
                        .format('mp4')
                        .stream().pipe(res);
                }
            }
        });
    });
}