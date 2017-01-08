import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Component({
    selector: 'my-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})

export class SearchComponent {
    page: number = 1;
    movies = [];
    years = [];
    genres = [
        '-', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
        'Documentary', 'Drama', 'Family', 'History', 'Horror',
        'Mystery', 'Reality', 'Romance', 'Sci-Fi', 'Thriller',
        'War', 'Western'
    ];
    sorts = [
        '-', 'title asc', 'title desc', 'year asc',
        'year desc', 'rating asc', 'rating desc'
    ];
    ratings = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    errorMsg = null;
    error: boolean = false;

    constructor(private http: Http){
        this.years.push('-');
        for (let i = 2017; i >= 1900; i--){
            this.years.push(i.toString());
        }
    }

    static searchChecks(from, to){
        if (from != '-' && to != '-'){
            return (parseInt(to) > parseInt(from));
        }
        return true;
    }

    static getString(name){
        if (name.length < 1)
            return "-";
        return name;
    }

    static getSort(sort){
        if (sort == "title asc")
            return "original_title.asc";
        else if (sort == "title desc")
            return "original_title.desc";
        else if (sort == "year desc")
            return "primary_release_date.desc";
        else if (sort == "year asc")
            return "primary_release_date.asc";
        else if (sort == "rating asc")
            return "vote_average.asc";
        else if (sort == "rating desc")
            return "vote_average.desc";
        return "-";
    }

    getMovies(title, person, keyword, fromYear, toYear, fromRate, toRate, genre, sort){
        let url = "http://localhost:4000/search/movies?";
        url = url + "page="+this.page;
        url = url + "&title="+SearchComponent.getString(title);
        url = url + "&cast="+SearchComponent.getString(person);
        url = url + "&word="+SearchComponent.getString(keyword);
        url = url + "&from_year="+fromYear;
        url = url + "&to_year="+toYear;
        url = url + "&rate_from="+fromRate;
        url = url + "&rate_to="+toRate;
        url = url + "&sort="+SearchComponent.getSort(sort);
        url = url + "&genre="+genre;
        this.http.get(url)
            .map(response => response.json())
            .catch(error => Observable.throw(error))
            .subscribe(
                response => {
                    console.log(response);
                    this.movies = response.data;
                },
                error => {
                    console.log(error);
                }
            );
    }

    searchBtn(title, person, keyword, fromYear, toYear, fromRate, toRate, genre, sort){
        this.error = false;
        this.errorMsg = null;
        if (SearchComponent.searchChecks(fromYear, toYear) && SearchComponent.searchChecks(fromRate, toRate)){
            this.getMovies(title, person, keyword, fromYear, toYear, fromRate, toRate, genre, sort);
        }else{
            this.error = true;
            if (!SearchComponent.searchChecks(fromYear, toYear))
                this.errorMsg = "Error with year search field";
            else
                this.errorMsg = "Error with year rating field";
        }
    }
}