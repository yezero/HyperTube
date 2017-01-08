//for our udp( announce property of the torrent)..to create
//a new socket instance. We will use 'udp4' for the standard
//IPv4 address format or you can use 'udp6' for IPv6 address format
const dgram = require('dgram');
//we need a buffer b'cos info sent over a socket are in buffer form
const Buffer = require('buffer').Buffer;
//url parse ets me easily extract different parts of the
// url like its protocol, hostname, port, etc
const urlParse = require('url').parse;
//importing my tools from tools.js
import tools from './tools';

module.exports.getPeers =  (torrent, info, callback) => {
    const socket = dgram.createSocket('udp4');
    //i will change this later
    const url = torrent.announce[0].toString('utf8');
    console.log("url: "+url);
    console.log(socket);
    //send the request
    udpSend(socket, buildConnReq(), url);
    socket.on('message', response => {
       if (respType(response) === 'connect'){
           //receive and parse connect response
           const connResp = parseConnResp(response);
           //send announce request
           const announceReq = buildAnnounceReq(connResp.id, torrent, info);
           console.log("connect response back");
           console.log(" i got: "+announceReq);
           udpSend(socket, announceReq, url);
       }else if (respType(response) === 'announce'){
           //parse announce response
           const announceResp = parseAnnounceResp(response);
           //pass peers back to callback
           callback(announceResp.peers);
       }
    });
};

function udpSend(socket, message, rawUrl, callback=()=>{}) {
    const url = urlParse(rawUrl);
    socket.send(message, 0, message.length, url.port, url.host, callback);
}

function respType(resp) {
    const action = resp.readUInt32BE(0);
    if (action === 0) return 'connect';
    if (action === 1) return 'announce';
}

/*
 * BEP describes how to build a connect request
 * Offset  Size            Name            Value
 * 0       64-bit integer  connection_id   0x41727101980
 * 8       32-bit integer  action          0 // connect
 * 12      32-bit integer  transaction_id  ? // random
 * 16
*/
//we will need crypto to create a random number for our buffer
var crypto = require('crypto');
function buildConnReq() {
    //i create a buffer with size 16bytes b'cos that is the total size of the message
    const buffer = Buffer.alloc(16);
    //adding the connection id..I split it into two b'cos the is no way to create
    //a 64byte once....i compensate that with offset..Instead of 8, i split to 0 && 4
    buffer.writeInt32BE(0x417, 0);
    buffer.writeInt32BE(0x27101980, 4);
    //action
    buffer.writeInt32BE(0, 8);
    //transaction_id(here is where we use crypto to generate a random 32bit integer
    crypto.randomBytes(4).copy(buffer, 12);
    console.log("connect req built: "+buffer);

    return buffer;
}

/*
 * this is the build response from connect format
 * Offset  Size            Name            Value
 * 0       32-bit integer  action          0 // connect
 * 4       32-bit integer  transaction_id
 * 8       64-bit integer  connection_id
 * 16
 */
function parseConnResp(resp) {
    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        connectionId: resp.slice(8) //I slice from the 8 offset to read the 64bit connectionId
    }
}

/* The announce message format
 * Offset  Size    Name    Value
 0       64-bit integer  connection_id
 8       32-bit integer  action          1 // announce
 12      32-bit integer  transaction_id
 16      20-byte string  info_hash
 36      20-byte string  peer_id
 56      64-bit integer  downloaded
 64      64-bit integer  left
 72      64-bit integer  uploaded
 80      32-bit integer  event           0 // 0: none; 1: completed; 2: started; 3: stopped
 84      32-bit integer  IP address      0 // default
 88      32-bit integer  key             ? // random
 92      32-bit integer  num_want        -1 // default
 96      16-bit integer  port            ? // should be betwee
 98
 *
 */
//the official spec says that the ports for bittorrent should be between 6881 and 6889
//and the default is 6881
function buildAnnounceReq(connId, torrent, info, port=6881) {
    const buffer = Buffer.allocUnsafe(98);
    //setting connection id
    connId.copy(buffer, 0);
    //action
    buffer.writeUInt32BE(1, 8);
    //transaction id...generate random 4 bytes
    crypto.randomBytes(4).copy(buffer, 12);
    //info hash already generated by magnet-uri into torrent
    torrent.infoHashBuffer.copy(buffer, 16);
    //peer id..randomly generated 20-byte string + an initials string not necessary
    tools.genId().copy(buffer, 36);
    //download
    Buffer.alloc(8).copy(buffer, 56);
    //left the size of the whole torrent
    tools.getSize(info.size.split(' ')[0]).copy(buffer, 64);
    // uploaded
    Buffer.alloc(8).copy(buf, 72);
    // event
    buf.writeUInt32BE(0, 80);
    // ip address
    buf.writeUInt32BE(0, 80);
    // key
    crypto.randomBytes(4).copy(buf, 88);
    // num want ..notice here i used Int32 not UInt3
    buf.writeInt32BE(-1, 92);
    // port
    buf.writeUInt16BE(port, 96);
    console.log("announce req built: "+buffer);
    return buffer;
}


/*
 * Offset      Size            Name            Value
 0           32-bit integer  action          1 // announce
 4           32-bit integer  transaction_id
 8           32-bit integer  interval
 12          32-bit integer  leechers
 16          32-bit integer  seeders
 20 + 6 * n  32-bit integer  IP address
 24 + 6 * n  16-bit integer  TCP port
 20 + 6 * N

 It’s a bit tricky because the number of addresses that
 come back isn’t fixed. The addresses come in groups of 6 bytes,
 the first 4 represent the IP address and the next 2
 represent the port. So our code will need to correctly break
 up the addresses part of the response.
 */
function parseAnnounceResp(resp) {
    function group(iterable, groupSize) {
        let groups = [];
        for (let i = 0; i < iterable.length; i += groupSize) {
            groups.push(iterable.slice(i, i + groupSize));
        }
        return groups;
    }

    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        leechers: resp.readUInt32BE(8),
        seeders: resp.readUInt32BE(12),
        peers: group(resp.slice(20), 6).map(address => {
            return {
                ip: address.slice(0, 4).join('.'),
                port: address.readUInt16BE(4)
            }
        })
    }
}