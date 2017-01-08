import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Router} from "@angular/router";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {JwtHelper, tokenNotExpired, AuthHttp} from "angular2-jwt";

@Injectable()
export class UserServices{
    apiAuth: boolean = false;
    apiMsg: string = null;

    constructor(private http: Http, private router: Router,
                private jwt: JwtHelper, private authhttp: AuthHttp){
        this.jwt = new JwtHelper();
    }

    signin(email: string, password: string){
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        let body = JSON.stringify({
            email: email,
            password: password
        });
        return this.http.post("http://localhost:3000/auth/signin", body, {headers: header})
            .map((response: Response) => {
                const res = response.json();
                localStorage.setItem('auth_token', res.token);
                localStorage.setItem('user_id', res.userId);
                const userInfo = this.jwt.decodeToken(res.token);
                localStorage.setItem('user_info', userInfo.user);
                return res;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    signup(username: string, firstname: string,
           lastname: string, email: string, password: string){
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        let body = JSON.stringify({
            userName: username,
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password
        });
        return this.http.post("http://localhost:3000/auth/signup", body, {headers: header})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    savedetails(user){
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        let body = JSON.stringify(user);
        return this.http.patch("http://localhost:3000/auth/" + user._id, body, {headers: header})
            .map((response: Response) => {
                    localStorage.clear();
                    const res = response.json();
                    localStorage.setItem('auth_token', res.token);
                    localStorage.setItem('user_id', res.userId);
                    const userInfo = this.jwt.decodeToken(res.token);
                    localStorage.setItem('user_info', userInfo.user);
                    return res;
                }
            )
            .catch((error: Response) => Observable.throw(error.json()));
    }

    logout(){
        localStorage.clear();
    }

    isLoggedIn(){
       return tokenNotExpired('auth_token');
    }

    tokenInfo(){
        const token = localStorage.getItem('auth_token');

        console.log(this.jwt.decodeToken(token));
        console.log(this.jwt.getTokenExpirationDate(token));
        console.log(this.jwt.isTokenExpired(token));
    }

    getUser(){
        const jwt = new JwtHelper();
        let user = jwt.decodeToken(localStorage.getItem('auth_token'));
        user = user.user;
        return user;
    }

    getUsers(){
        return this.http.get("http://localhost:3000/services/getusers")
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }
}