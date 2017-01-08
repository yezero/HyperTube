import fs from 'fs';//file system for creating / reading stream
import Bencode from 'bencode';//to decode a .torrent file
import Http from 'http';
import PirateBay from './pirateBay';
import HttpDispatcher from 'httpdispatcher';
import Tracker from './tracker';

function torrent(request, response) {
    console.log(request.url);
    if (request.url == '/test'){
        response.end('Test working');
    }else if (request.url == '/pirate'){
        piratebay(request, response);
    }else{
        response.end('404 not found');
    }
}

const server = Http.createServer(torrent);

server.listen(3500, () => console.log("Server listening on http://localhost:3500"));

function pirateCallback(success, result) {
    if (success){
        console.log('success');
        console.log(result);
    }
}

function piratebay(request, response) {
    PirateBay.myPirateBay('Sherlock S04E01', torrentInfo => {
        if (torrentInfo.status == false){
            console.log('my Error');
            console.log(torrentInfo.error);
            return response.end('Failed on pirate bay');
        }
        console.log(torrentInfo.torrent);
        console.log("***********DECODED*********");
        console.log(torrentInfo.decode);
        console.log('+++++tracker started+++++');
        Tracker.getPeers(torrentInfo.decode, torrentInfo.torrent, peers => {
            console.log('list of peers: ', peers);
            console.log('+++++tracker ended+++++');
        });
        response.end(JSON.stringify(torrentInfo));
    })
}