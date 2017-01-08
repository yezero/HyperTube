var express = require('express');
var router = express.Router();
var passport = require('passport');
var fortyTwoStrategy = require('passport-42').Strategy;

router.get('/facebook', function (req, res, next) {
    res.redirect("https://www.facebook.com/v2.8/dialog/oauth?client_id=1846290908954876"
        + "&response_type=token&display=popup"
        + "&redirect_uri=http://localhost:3000/fbAuth"
        + "&scope=public_profile,email");
});

//setting up 42 api
passport.use(new fortyTwoStrategy({
        clientID: "90d06caee047f6775b468dec7125fa69157d696210c27ee11e5bd53c130fc2ce",
        clientSecret: "8e17dbebf770789e1134ea010d7239fdf0c960a24bec36d4092a8b57bc92be72",
        callbackURL: 'http://localhost:4000/auth/42auth'
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/42', passport.authenticate('42'));

router.get('/42auth',
    passport.authenticate('42', { failureRedirect: 'http://localhost:3000/signin' }),
    function (req, res, next) {
        var first = req.user.name.givenName;
        var last = req.user.name.familyName;
        var email = req.user.emails[0].value;
        var img = req.user.photos[0].value;
        //console.log(req.user);
        res.redirect("http://localhost:3000/wtcAuth?first="+first+"&last="+last+"&email="+email+"&img="+img);
    }
);

router.get("/42info", function (req, res, next) {
    console.log(req.user);
    res.status(201).json({
        title: "success",
        data: req.user
    });
});

module.exports = router;