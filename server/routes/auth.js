var express = require('express');
var router = express.Router();
var fs = require('fs');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.post('/', function(req, res, next) {
    return res.status(500).json({
        title: 'An error occurred',
        err: {message: 'user authentication failed'}
    });
});

router.post('/signup', function(req, res, next) {
    var user = new User({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        image: new Buffer(fs.readFileSync('./public/images/avatar.png')).toString('base64'),
        favView: false,
        watchView: false,
        recentView: false,
        year: '2017',
        country: 'South Africa',
        bio: ""
    });
    user.save(function (err, result) {
        if (err){
             return res.status(500).json({
                title: 'error occurred',
                error: err
            })
        }
        res.status(201).json({
            title: 'user created',
            obj: result
        });
    })
});

router.post('/signin', function (req, res, next) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err){
            return res.status(500).json({
                title: 'error occurred',
                error: err
            });
        }
        if (!user){
            return res.status(401).json({
                title: 'login failed',
                error: {message: 'Invalid login details'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).json({
                title: 'login failed',
                error: {message: 'Invalid login details'}
            });
        }
        var token = jwt.sign({user: user}, 'tmack42sasiedu', {expiresIn: 7200});
        res.status(201).json({
            message: 'login successful',
            token: token,
            userId: user._id
        })
    });
});

router.patch('/:id', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err){
            return res.status(500).json({
                title: 'error occurred',
                error: err
            })
        }
        if (!user){
            return res.status(500).json({
                title: 'error occurred',
                error: {message: 'user not found'}
            })
        }
        user.userName = req.body.userName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.image = req.body.image;
        user.token = req.body.token;
        user.messages = req.body.messages;
        user.favView = req.body.favView;
        user.watchView = req.body.watchView;
        user.recentView = req.body.recentView;
        user.favList = req.body.favList;
        user.watchList = req.body.watchList;
        user.likeList = req.body.likeList;
        user.recentList = req.body.recentList;
        user.year = req.body.year;
        user.bio = req.body.bio;
        user.save(function (err, updateuser) {
            if (err){
                return res.status(500).json({
                    title: 'error occurred',
                    error: err
                })
            }
            var token = jwt.sign({user: updateuser}, 'tmack42sasiedu', {expiresIn: 7200});
            res.status(201).json({
                message: 'update successful',
                token: token,
                userId: updateuser._id
            })
        })
    });
});

module.exports = router;
