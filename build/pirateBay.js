'use strict';

var _magnetUri = require('magnet-uri');

var _magnetUri2 = _interopRequireDefault(_magnetUri);

var _thepiratebay = require('thepiratebay');

var _thepiratebay2 = _interopRequireDefault(_thepiratebay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * I AM USING ES6 (EMCA 6...javascript syntax)
 */
//this is used to retrieve the magnet information to start my torrenting
module.exports.myPirateBay = function (title, callback) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _thepiratebay2.default.search(title, {
        category: 'all',
        orderBy: 'seeds',
        sortBy: 'desc'
    }).then(function (result) {
        return callback({
            status: true,
            torrent: result[0],
            decode: _magnetUri2.default.decode(result[0].magnetLink)
        });
    }).catch(function (err) {
        return callback({
            status: false,
            error: err
        });
    });
};
//this is piratesApi for connection and retrieving info