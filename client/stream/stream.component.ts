import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

@Component({
    selector: "my-stream",
    templateUrl: "./stream.component.html",
    styleUrls: ['./stream.component.css']
})
export class StreamComponent{
    movieFeed = null;
    magnet="";
    id;
    type;
    title;
    isPlaying: boolean = false;
    retries: number = 0;
    error: boolean = false;
    errorMsg = "Server Error";

    constructor(private http: Http, private router: ActivatedRoute){
        this.router.params.subscribe(
            params => {
                this.id = +params['id'];
                this.type = params['type'];
                this.title = params['name'];
                console.log(this.title);
                this.callPirateBay();
            }
        );
    }

    callPirateBay(){
        this.http.get("http://localhost:3500/pirate?title="+this.title+"&type="+this.type)
            .map(resp => resp.json())
            .catch(error => Observable.throw(error))
            .subscribe(
                resp => {
                    if (resp.title === 'failed'){
                        if (this.retries < 6){
                            console.log('retrying');
                            this.retries += 1;
                            this.callPirateBay();
                        }else{

                        }
                    }else{
                        this.magnet = resp.magnet;
                        this.movieFeed = "http://localhost:3500/uri/"+this.magnet;
                    }
                },
                error => {
                    console.log('error from pirateBay');
                }
            );
    }


    onVideoClick(event){
        console.log("video click");
        console.log(event);
        console.log(event.target);
        if (this.isPlaying){
            event.target.pause();
            this.isPlaying = false;
        }else{
            event.target.play();
            this.isPlaying = true;
        }
    }

    changePlayStatus(value: boolean){
        this.isPlaying = value;
        console.log("changing play status to: "+this.isPlaying);
    }
}