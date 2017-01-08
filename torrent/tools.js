import bignum from 'bignum';
import bytes from 'bytes';

module.exports.getSize = (size) => {
    console.log("current size: "+size);
    //convert size to bytes
    const byteSize = bytes.parse(size+'gb');
    console.log("byte size: "+byteSize);
    //change to bignum to able to store it in 8bytes buffer
    const bufferSize = bignum.toBuffer(byteSize, {size: 8});
    console.log(bufferSize);
    return bufferSize;
};

const crypto = require('crypto');

let id = null;
//this is generating my peer id,
//A peer id can basically be any random 20-byte string
// but most clients follow a convention by adding "a name"
module.exports.genId = () => {
    if (!id) {
        id = crypto.randomBytes(20);
        Buffer.from('-SA0001-').copy(id, 0);
    }
    return id;
};