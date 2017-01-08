'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bencode = require('bencode');

var _bencode2 = _interopRequireDefault(_bencode);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _pirateBay = require('./pirateBay');

var _pirateBay2 = _interopRequireDefault(_pirateBay);

var _httpdispatcher = require('httpdispatcher');

var _httpdispatcher2 = _interopRequireDefault(_httpdispatcher);

var _tracker = require('./tracker');

var _tracker2 = _interopRequireDefault(_tracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//to decode a .torrent file
function torrent(request, response) {
    console.log(request.url);
    if (request.url == '/test') {
        response.end('Test working');
    } else if (request.url == '/pirate') {
        piratebay(request, response);
    } else {
        response.end('404 not found');
    }
} //file system for creating / reading stream


var server = _http2.default.createServer(torrent);

server.listen(3500, function () {
    return console.log("Server listening on http://localhost:3500");
});

function pirateCallback(success, result) {
    if (success) {
        console.log('success');
        console.log(result);
    }
}

function piratebay(request, response) {
    _pirateBay2.default.myPirateBay('Sherlock S04E01', function (torrentInfo) {
        if (torrentInfo.status == false) {
            console.log('my Error');
            console.log(torrentInfo.error);
            return response.end('Failed on pirate bay');
        }
        console.log(torrentInfo.torrent);
        console.log("***********DECODED*********");
        console.log(torrentInfo.decode);
        console.log('+++++tracker started+++++');
        _tracker2.default.getPeers(torrentInfo.decode, torrentInfo.torrent, function (peers) {
            console.log('list of peers: ', peers);
            console.log('+++++tracker ended+++++');
        });
        response.end(JSON.stringify(torrentInfo));
    });
}