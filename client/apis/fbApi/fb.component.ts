import {Component} from "@angular/core";
import { Router} from '@angular/router';
import {UserServices} from "../../services/user.services";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {JwtHelper, } from "angular2-jwt";

@Component({
    selector: 'my-fb',
    template: `
              <html>
                <head>
                </head>
                <body>Redirecting...</body>
              </html>
            `
})

export class FbApiComponent{
    constructor(private router: Router,
                private userservices: UserServices,
                private http: Http, private jwt: JwtHelper
    ){
        this.jwt = new JwtHelper();
        const status = this.router.url.slice(8, 20);

        if (status !== "access_token"){
            this.userservices.apiAuth = true;
            this.userservices.apiMsg = "Facebook login failed";
            this.router.navigate(['/auth', 'signin']);
            return ;
        }
        const token = this.router.url.split('#')[1]
            .split('&')[0].split('=')[1];
        this.facebookSuccess(token)
            .subscribe(
                data => {
                    this.facebookDetails(data, token);
                },
                error => {
                    this.userservices.apiAuth = true;
                    this.userservices.apiMsg = error.message;
                }
            );
    }

    facebookSuccess(token: string){
        console.log("token: " + token);
        return this.http.get("https://graph.facebook.com/me?fields=id,email,name,picture&access_token=" + token)
            .map(res => res.json())
            .catch(error => Observable.throw(error.json()));
    }

    facebookDetails(data, token){
        console.log(data);
        this.http.get("https://graph.facebook.com/me/picture?type=large&access_token=" + token)
            .subscribe(
                res => {
                    console.log(res);
                    data.picture.data.url = res.url;
                    this.facebookContinue(data);
                }
            );
    }

    facebookContinue(data){
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        let body = JSON.stringify({
            email: data.email,
            firstName: data.name.split(' ')[0],
            lastName: data.name.split(' ')[1],
            image: data.picture.data.url
        });
        this.http.post("http://localhost:3000/api/facebook", body, {headers: header})
            .subscribe(
                (response: Response) => {
                    const res = response.json();
                    if (res.title !== "good"){
                        this.userservices.apiAuth = true;
                        this.userservices.apiMsg = res.message;
                        return ;
                    }
                    localStorage.setItem('auth_token', res.token);
                    localStorage.setItem('user_id', res.userId);
                    const userInfo = this.jwt.decodeToken(res.token);
                    localStorage.setItem('user_info', userInfo.user);
                    window.close();
                    let oldWin = window.open('http://localhost:3000/home', "win1");
                    oldWin.focus();
                }
            );
    }
}