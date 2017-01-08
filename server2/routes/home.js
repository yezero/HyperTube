var express = require('express');
var router = express.Router();
var request = require('request');

function getGenre(id) {
    var genres = [
        {"id": 28, "name": "Action"
        }, {"id": 12, "name": "Adventure"
        }, {"id": 16, "name": "Animation"
        }, {"id": 35, "name": "Comedy"
        }, {"id": 80, "name": "Crime"
        }, {"id": 99, "name": "Documentary"
        }, {"id": 18, "name": "Drama"
        }, {"id": 10751, "name": "Family"
        }, {"id": 14, "name": "Fantasy"
        }, {"id": 36, "name": "History"
        }, {"id": 27, "name": "Horror"
        }, {"id": 10402, "name": "Music"
        }, {"id": 9648, "name": "Mystery"
        }, {"id": 10749, "name": "Romance"
        }, {"id": 878, "name": "Science Fiction"
        }, {"id": 10770, "name": "TV Movie"
        }, {"id": 53, "name": "Thriller"
        }, {"id": 10752, "name": "War"
        }, {"id": 37, "name": "Western"}
    ];

    for (var i = 0; i < genres.length; i++){
        if (id == genres[i].id)
            return genres[i].name;
    }
    return null;
}

function seriesGenre(id) {
    var genres = [
        {"id": 10759, "name": "Action & Adventure"
        }, {"id": 16, "name": "Animation"
        }, {"id": 35, "name": "Comedy"
        },{"id": 80, "name": "Crime"
        }, {"id": 99, "name": "Documentary"
        }, {"id": 18, "name": "Drama"
        }, {"id": 10751, "name": "Family"
        }, {"id": 10762, "name": "Kids"
        }, {"id": 9648, "name": "Mystery"
        }, {"id": 10763, "name": "News"
        }, {"id": 10764, "name": "Reality"
        }, {"id": 10765, "name": "Sci-Fi & Fantasy"
        }, {"id": 10766, "name": "Soap"
        }, {"id": 10767, "name": "Talk"
        }, {"id": 10768, "name": "War & Politics"
        }, {"id": 37, "name": "Western"}
    ];
    for (var i = 0; i < genres.length; i++){
        if (id == genres[i].id)
            return genres[i].name;
    }
    return null;
}

function getInfo(result) {
    return {
        id: result.id,
        title: result.title,
        genre: getGenre(result.genre_ids[0]),
        year: result.release_date.split('-')[0],
        type: 'movie',
        image: "http://image.tmdb.org/t/p/" + "w500" + result.poster_path
    };
}

function getInfo2(result) {
    return {
        id: result.id,
        title: result.original_name,
        genre: seriesGenre(result.genre_ids[0]),
        year: result.first_air_date.split('-')[0],
        type: 'series',
        image: "http://image.tmdb.org/t/p/" + "w500" + result.poster_path
    };
}

function arrange(results, type) {
    var i = 0;
    var ind = 0;
    var group =[];
    while (i < 4){
        if (results[ind].poster_path != null){
            if (type == 'movie')
                var data = getInfo(results[ind]);
            else
                var data = getInfo2(results[ind]);
            group.push(data);
            i++;
        }
        ind++;
    }
    return group;
}

router.get('/theater', function (req, res, next) {
    var url = "https://api.themoviedb.org/3/discover/movie?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&" +
        "language=en-US&page=1&" +
        "primary_release_date.gte=2016-12-25&" +
        "primary_release_date.lte=2017-01-12&" +
        "with_original_language=en";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var group = arrange(newBody.results, 'movie');
        res.status(201).json({
            title: 'Success',
            body: group
        });
    })
});

router.get('/watched', function (req, res, next) {
    var url = "https://api.themoviedb.org/3/discover/movie?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&" +
        "language=en-US&" +
        "sort_by=popularity.desc&page=1&" +
        "primary_release_date.gte=2010-01-01&" +
        "primary_release_date.lte=2017-01-12&" +
        "with_original_language=en";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var group = arrange(newBody.results, 'movie');
        res.status(201).json({
            title: 'Success',
            body: group
        });
    })
});

router.get('/rated', function (req, res, next) {
    var url = "https://api.themoviedb.org/3/discover/movie?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US&" +
        "sort_by=vote_count.desc&page=1&" +
        "primary_release_date.gte=2014-01-01&" +
        "primary_release_date.lte=2017-01-12&with_original_language=en";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var group = arrange(newBody.results, 'movie');
        res.status(201).json({
            title: 'Success',
            body: group
        });
    })
});

router.get('/ontv', function (req, res, next) {
    var url = "https://api.themoviedb.org/3/discover/tv?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US&" +
        "air_date.gte=2016-12-20&air_date.lte=2017-01-12&" +
        "page=1&timezone=America/New_York&" +
        "include_null_first_air_dates=false";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var group = arrange(newBody.results, 'series');
        res.status(201).json({
            title: 'Success',
            body: group
        });
    })
});

router.get('/watched2', function (req, res, next) {
    var url = "https://api.themoviedb.org/3/discover/tv?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US&" +
        "sort_by=popularity.desc&air_date.gte=2013-01-01&" +
        "air_date.lte=2017-01-12&page=1&" +
        "timezone=America/New_York&" +
        "include_null_first_air_dates=false";
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200){
            return res.status(500).json({
                title: "An error occurred",
                err: err,
                error: {message: 'internal server error'}
            });
        }
        var newBody = JSON.parse(body);
        var group = arrange(newBody.results, 'series');
        res.status(201).json({
            title: 'Success',
            body: group
        });
    })
});

module.exports = router;