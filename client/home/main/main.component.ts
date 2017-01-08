import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Component({
    selector: 'my-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
    Groups = [
        {title: 'In Theater', movies: null},
        {title: 'On Tv', movies: null},
        {title: 'Most Watched', movies: null},
        {title: 'Highest Rated', movies: null},
        {title: 'Popular', movies: null}
    ];

    constructor(private http: Http){
    }

    ngOnInit(){
        this.loadPage();
    }

    loadPage(){
        this.inTheater();
        this.mostWatched();
        this.highestRated();
        this.onTv();
        this.popular();
    }

    inTheater(){
        this.http.get("http://localhost:4000/home/theater")
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe(
                data => {
                    this.Groups[0].movies = data.body;
                }
            );
    }

    mostWatched(){
        this.http.get("http://localhost:4000/home/watched")
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe(
                data => {
                    this.Groups[2].movies = data.body;
                }
            );
    }

    highestRated(){
        this.http.get("http://localhost:4000/home/rated")
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe(
                data => {
                    this.Groups[3].movies = data.body;
                }
            );
    }

    onTv(){
        this.http.get("http://localhost:4000/home/ontv")
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe(
                data => {
                    this.Groups[1].movies = data.body;
                }
            );
    }

    popular(){
        this.http.get("http://localhost:4000/home/watched2")
            .map(data => data.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe(
                data => {
                    this.Groups[4].movies = data.body;
                }
            );
    }
}