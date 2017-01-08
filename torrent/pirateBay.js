/*
 * I AM USING ES6 (EMCA 6...javascript syntax)
 */
//this is used to retrieve the magnet information to start my torrenting
import magnetUri from 'magnet-uri';
//this is piratesApi for connection and retrieving info
import pirateBay from 'thepiratebay';

module.exports.myPirateBay = (title, callback, opt = null) => {
    pirateBay.search(title, {
        category: 'all',
        orderBy: 'seeds',
        sortBy: 'desc'
    })
        .then(result => callback({
            status: true,
            torrent: result[0],
            decode: magnetUri.decode(result[0].magnetLink)
        }))
        .catch(err => callback({
            status: false,
            error: err
        }));
};