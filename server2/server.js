var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//routes
var apiRoute = require('./routes/authApi');
var apiHome = require('./routes/home');
var apiBrowse = require('./routes/browse');
var apiMovie = require('./routes/movie');
var apiSearch = require('./routes/search');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Header', 'Origin, x-requested-with, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATH, DELETE, OPTIONS');
    next();
});

app.use('/search', apiSearch);
app.use('/movies', apiMovie);
app.use('/browse', apiBrowse);
app.use('/home', apiHome);
app.use('/auth', apiRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.redirect("http://localhost:3000");
});

module.exports = app;
