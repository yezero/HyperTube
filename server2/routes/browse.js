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

function getGenreId(name) {
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
        if (name == genres[i].name)
            return genres[i].id;
    }
    return 0;
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

function seriesGenreId(name) {
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
        if (name == genres[i].name)
            return genres[i].id;
    }
    return 0;
}

function getInfo(result) {
    return {
        id: result.id,
        title: result.title,
        genre: getGenre(result.genre_ids[0]),
        year: result.release_date.split('-')[0],
        type: 'movie',
        image: "http://image.tmdb.org/t/p/" + "w500" + result.poster_path,
        rating: result.vote_average
    };
}

function getInfo2(result) {
    return {
        id: result.id,
        title: result.original_name,
        genre: seriesGenre(result.genre_ids[0]),
        year: result.first_air_date.split('-')[0],
        type: 'series',
        image: "http://image.tmdb.org/t/p/" + "w500" + result.poster_path,
        rating: result.vote_average
    };
}

function arrange(results, type) {
    var data;
    var group =[];
    for(var i = 0; i < results.length; i++){
        if (results[i].poster_path != null){
            if (type == 'movie')
                data = getInfo(results[i]);
            else
                data = getInfo2(results[i]);
            group.push(data);
        }
    }
    return group;
}

router.get('/movies', function (req, res, next) {
    var url = "https://api.themoviedb.org/3/discover/movie?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US&with_original_language=en";
    url = url+'&page='+req.query.page;
    if (req.query.year != 'Any')
        url = url+'&year='+req.query.year;
    if (req.query.genre != 'All')
        url = url+'&with_genres='+getGenreId(req.query.genre);
    if(req.query.sort != 'Any')
        url = url+'&sort_by='+req.query.sort;
    console.log(url);
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
            title: 'success',
            data: group
        });
    });
});

router.get('/series', function (req, res, next) {
    var url = "https://api.themoviedb.org/3/discover/tv?" +
        "api_key=88fb971d6edf2b3de88914b0157a7cca&language=en-US&with_original_language=en";
    url = url+'&page='+req.query.page;
    if (req.query.year != 'Any')
        url = url+'&first_air_date_year='+req.query.year;
    if (req.query.genre != 'All')
        url = url+'&with_genres='+seriesGenreId(req.query.genre);
    if(req.query.sort != 'Any')
        url = url+'&sort_by='+req.query.sort;
    console.log(url);
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
            title: 'success',
            data: group
        });
    });
});

module.exports = router;