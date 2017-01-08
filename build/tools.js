'use strict';

var _bignum = require('bignum');

var _bignum2 = _interopRequireDefault(_bignum);

var _bytes = require('bytes');

var _bytes2 = _interopRequireDefault(_bytes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.getSize = function (size) {
    console.log("current size: " + size);
    //convert size to bytes
    var byteSize = _bytes2.default.parse(size + 'gb');
    console.log("byte size: " + byteSize);
    //change to bignum to able to store it in 8bytes buffer
    var bufferSize = _bignum2.default.toBuffer(byteSize, { size: 8 });
    console.log(bufferSize);
    return bufferSize;
};

var crypto = require('crypto');

var id = null;
//this is generating my peer id,
//A peer id can basically be any random 20-byte string
// but most clients follow a convention by adding "a name"
module.exports.genId = function () {
    if (!id) {
        id = crypto.randomBytes(20);
        Buffer.from('-SA0001-').copy(id, 0);
    }
    return id;
};