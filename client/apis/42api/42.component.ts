import {Component} from "@angular/core";
import {Router, ActivatedRoute} from '@angular/router';
import {UserServices} from "../../services/user.services";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {JwtHelper, } from "angular2-jwt";

@Component({
    selector: 'my-42',
    template: `
              <html>
                <head>
                </head>
                <body>Redirecting...</body>
              </html>
            `
})
export class WtcApiComponent{
    constructor(private router: Router, private activatedRouter: ActivatedRoute,
                private userservices: UserServices,
                private http: Http, private jwt: JwtHelper
    ){
        this.activatedRouter.queryParams.subscribe(
            (param: any) => {
                var first = param['first'];
                var last = param['last'];
                var email = param['email'];
                var img = param['img'];
                console.log(first);
                console.log(last);
                console.log(email);
                console.log(img);
                this.loginDetails(first, last, email, img);
            }
        );
    }

    loginDetails(first, last, email, img) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        let body = JSON.stringify({
            email: email,
            firstName: first,
            lastName: last,
            image: img
        });
        this.http.post("http://localhost:3000/api/facebook", body, {headers: header})
            .subscribe(
                (response: Response) => {
                    const res = response.json();
                    if (res.title !== "good") {
                        this.userservices.apiAuth = true;
                        this.userservices.apiMsg = res.message;
                        return;
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