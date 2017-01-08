var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/getusers', function (req, res, next) {
    User.find(function (err, data) {
        if (err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var users = [];
        for (var i = 0; i < data.length; i++){
            var user = {
                userName: data[i].userName,
                firstName: data[i].firstName,
                lastName: data[i].lastName,
                image: data[i].image,
                favView: data[i].favView,
                watchView: data[i].watchView,
                recentView: data[i].recentView,
                favList: data[i].favList,
                watchList: data[i].watchList,
                recentList: data[i].recentList,
                likeList: data[i].likeList,
                year: data[i].year,
                bio: data[i].bio,
                country: data[i].country
            };
            users.push(user);
        }
        res.status(201).json({
            title: 'got users list',
            users: users
        })
    })
});

module.exports = router;