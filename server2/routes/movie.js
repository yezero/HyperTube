var express = require('express');
var router = express.Router();
var request = require('request');

function extraInfo(body) {
    return {
        id: body.id,
        title: body.original_title,
        rating: body.vote_average,
        runtime: body.runtime,
        year: body.release_date.split('-')[0],
        language: body.original_language,
        image: "http://image.tmdb.org/t/p/" + "w500" + body.poster_path,
        overview: body.overview,
        type: 'movie',
        genre: body.genres[0].name
    }
}

function extraInfo2(body) {
    return {
        id: body.id,
        title: body.name,
        rating: body.vote_average,
        runtime: body.runtime,
        language: body.original_language,
        image: "http://image.tmdb.org/t/p/" + "w500" + body.poster_path,
        overview: body.overview,
        type: 'series',
        genre: body.genres[0].name,
        first: body.first_air_date,
        year: body.first_air_date.split('-')[0],
        last: body.last_air_date,
        seasons: body.number_of_seasons,
        episodes: body.number_of_episodes
    }
}

router.get('/movie', function (req, res, next) {
    url = "https://api.themoviedb.org/3/movie/"+req.query.id+"?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var details = extraInfo(newBody);
        var genres = newBody.genres;
        res.status(201).json({
            title: 'success',
            details: details,
            genres: genres
        })
    });
});

router.get('/series', function (req, res, next) {
    url = "https://api.themoviedb.org/3/tv/"+req.query.id+"?api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var details = extraInfo2(newBody);
        var genres = newBody.genres;
        res.status(201).json({
            title: 'success',
            details: details,
            genres: genres
        })
    });
});

function getCast(casts) {
    var cast = [];

    for (var i = 0; i < casts.length; i++){
        cast.push({
            name: casts[i].name,
            character: casts[i].character,
            image: "http://image.tmdb.org/t/p/" + "w500" + casts[i].profile_path
        });
    }
    return cast;
}

router.get('/mcast', function (req, res, next) {
    url = "https://api.themoviedb.org/3/movie/"+req.query.id+"/credits?api_key=88fb971d6edf2b3de88914b0157a7cca";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var casts = getCast(newBody.cast);
        res.status(201).json({
            title: 'success',
            cast: casts
        });
    })
});

router.get('/scast', function (req, res, next) {
    url = "https://api.themoviedb.org/3/tv/"+req.query.id+"/credits?api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var casts = getCast(newBody.cast);
        res.status(201).json({
            title: 'success',
            cast: casts
        });
    })
});

function sameMovies(results) {
    var same = [];

    for (var i = 0; i < results.length && i < 4; i++){
        same.push({
            title: results[i].original_title,
            image: "http://image.tmdb.org/t/p/" + "w500" + results[i].poster_path,
            id: results[i].id,
            type: 'movie'
        });
    }
    return same;
}

router.get('/msame', function (req, res, next) {
    url = "https://api.themoviedb.org/3/movie/"+req.query.id+"/similar?api_key=88fb971d6edf2b3de88914b0157a7cca&page=1";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var same = sameMovies(newBody.results);
        res.status(201).json({
            title: 'success',
            data: same
        });
    });
});

function sameSeries(results) {
    var same = [];

    for (var i = 0; i < results.length && i < 4; i++){
        same.push({
            title: results[i].name,
            image: "http://image.tmdb.org/t/p/" + "w500" + results[i].poster_path,
            id: results[i].id,
            type: 'series'
        });
    }
    return same;
}

router.get('/ssame', function (req, res, next) {
    url = "https://api.themoviedb.org/3/tv/"+req.query.id+"/similar?api_key=88fb971d6edf2b3de88914b0157a7cca&page=1";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var same = sameSeries(newBody.results);
        res.status(201).json({
            title: 'success',
            data: same
        });
    });
});

function movieReviews(reviews) {
    var review = [];

    for (var i = 0; i < reviews.length; i++){
        review.push({
            name: reviews[i].author,
            content: reviews[i].content
        });
    }
    return review;
}

router.get('/review', function (req, res, next) {
    url = "https://api.themoviedb.org/3/movie/"+req.query.id+"/reviews?api_key=88fb971d6edf2b3de88914b0157a7cca";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var reviews = movieReviews(newBody.results);
        res.status(201).json({
            title: 'success',
            reviews: reviews
        });
    });
});

module.exports = router;