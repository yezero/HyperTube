import {Component} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";

@Component({
    selector: 'my-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.css']
})

export class BrowseComponent{
    isMovies: boolean = true;
    page: number = 1;
    type: string = 'movie';
    movies = [];
    years = [];
    genres = [
        'All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
        'Documentary', 'Drama', 'Family', 'History', 'Horror',
        'Mystery', 'Reality', 'Romance', 'Sci-Fi', 'Thriller',
        'War', 'Western'
    ];
    sorts = [
        'Any', 'title asc', 'title desc', 'year asc',
        'year desc', 'rating asc', 'rating desc'
    ];

    constructor(private http: Http){
        this.years.push('Any');
        for (let i = 2017; i >= 1900; i--){
            this.years.push(i.toString());
        }
        this.getMovies('Any', 'All', 'Any');
        this.getSeries('Any', 'All', 'Any');
    }

    isMoviesTab(value: boolean, type: string){
        this.isMovies = value;
        this.type = type;
    }

    filter(year, genre, sort) {
        let yy = 'Any';
        let gg = 'All';
        let ss = 'Any';
        if (year.value != "Any")
            yy = year.value;
        if (genre.value != "All")
            gg = genre.value;
        if (sort.value == "title asc")
            ss = "original_title.asc";
        else if (sort.value == "title desc")
            ss = "original_title.desc";
        else if (sort.value == "year desc")
            ss = "primary_release_date.desc";
        else if (sort.value == "year asc")
            ss = "primary_release_date.asc";
        else if (sort.value == "rating asc")
            ss = "vote_average.asc";
        else if (sort.value == "rating desc")
            ss = "vote_average.desc";
        else
            ss = "Any";
        this.getMovies(yy, gg, ss);
        this.getSeries(yy, gg, ss);
    }

    getMovies(year, genre, sort){
        this.http.get("http://localhost:4000/browse/movies?year="+year+"&page="+this.page+"&genre="+genre+"&sort="+sort)
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe(
                data => {
                    this.movies = data.data;
                }
            );
    }

    getSeries(year, genre, sort){
        this.http.get("http://localhost:4000/browse/series?year="+year+"&page="+this.page+"&genre="+genre+"&sort="+sort)
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe(
                data => {
                    this.movies.push.apply(this.movies, data.data);
                }
            );
    }
}