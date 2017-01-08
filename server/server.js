var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var $ = require('jquery');

var indexRoutes = require('./routes/index');
var authRoutes = require('./routes/auth');
var apiRoutes = require('./routes/api');
var serviceRoutes = require('./routes/service');

var app = express();
mongoose.connect('localhost:27017/htube');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Header', 'Origin, x-requested-with, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATH, DELETE, OPTIONS');
    next();
});

app.use('/services', serviceRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/', indexRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('index');
});

module.exports = app;
