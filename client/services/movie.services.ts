import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class MovieServices {
    movieDbGenres: string[] = [];

    constructor(private http: Http){
        this.movieDbGenres[10759] = "Action & Adventure";
        this.movieDbGenres[16] = "Animation";
        this.movieDbGenres[35] = "Comedy";
        this.movieDbGenres[80] = "Crime";
        this.movieDbGenres[99] = "Documentary";
        this.movieDbGenres[18] = "Drama";
        this.movieDbGenres[10751] = "Family";
        this.movieDbGenres[10762] = "Kids";
        this.movieDbGenres[9648] = "Mystery";
        this.movieDbGenres[10763] = "News";
        this.movieDbGenres[10764] = "Reality";
        this.movieDbGenres[10765] = "Sci-Fi & Fantasy";
        this.movieDbGenres[10766] = "Soap";
        this.movieDbGenres[10767] = "Talk";
        this.movieDbGenres[10768] = "War & Politics";
        this.movieDbGenres[37] = "Western";
    }

    simpleGetYts(limit: number, sort: string, order: string){
        let url = "https://yts.ag/api/v2/list_movies.json?";

        url = url + "sort_by=" + sort + "&limit=" + limit;
        url = url + "&order_by=" + order;
        return this.http.get(url)
            .map((response) => {
                const movies = [];
                const res = response.json();
                const YtsMovies = res.data.movies;
                for (let i = 0; i < limit; i++){
                    let movie = {
                        from: 'server1',
                        id: YtsMovies[i].id,
                        title: YtsMovies[i].title,
                        bigImage: YtsMovies[i].large_cover_image,
                        medImage: YtsMovies[i].medium_cover_image,
                        rating: YtsMovies[i].rating,
                        genre: YtsMovies[i].genres[0],
                        year: YtsMovies[i].year,
                        summary: YtsMovies[i].summary,
                        full: YtsMovies[i].description_full,
                        type: 'movie',
                        movie: YtsMovies[i]
                    };
                    movies.push(movie);
                }
                return movies;
            });
    }

    advanceGetYts(limit: number, genre: string, year: string, sort: string,
                  rating: number, page: number, count: number){
        let url = "https://yts.ag/api/v2/list_movies.json?";
        url = url + "limit=" + limit;
        if (genre != null){url = url + "&genre="+genre;}
        if (sort != null){
            url = url + "&sort_by="+sort.split(" ")[0];
            url = url + "&order_by="+sort.split(" ")[0];
        }
        if (rating != 0){url = url + "&minimum_rating="+rating;}
        if (page != 0){url = url + "&page="+page;}
        return this.http.get(url)
            .map((response) => {
                const movies = [];
                const res = response.json();
                const YtsMovies = res.data.movies;
                for (let i = 0; i < count; i++){
                    if (year == null || year == YtsMovies[i].year){
                        let movie = {
                            from: 'server1',
                            id: YtsMovies[i].id,
                            title: YtsMovies[i].title,
                            bigImage: YtsMovies[i].large_cover_image,
                            medImage: YtsMovies[i].medium_cover_image,
                            rating: YtsMovies[i].rating,
                            genre: YtsMovies[i].genres[0],
                            year: YtsMovies[i].year,
                            summary: YtsMovies[i].summary,
                            full: YtsMovies[i].description_full,
                            type: 'movie',
                            movie: YtsMovies[i]
                        };
                        movies.push(movie);
                    }
                }
                if (movies.length < count && page < 120){
                    const tmp = this.advanceGetYts(limit,
                    genre, year, sort, rating, page + 1, count - movies.length)
                        .subscribe(
                            data => {
                                for (let mov of data){
                                    movies.push(mov);
                                }
                            }
                        );
                }
                return movies;
            });
    }

    getById(id){
        let url = "https://yts.ag/api/v2/movie_details.json?movie_id="+id+"&with_images=true&with_cast=true"

        return this.http.get(url)
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()));
    }

    getReviewById(id){
        let url = "https://yts.ag/api/v2/movie_reviews.json?movie_id="+id;

        return this.http.get(url)
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()));
    }
}