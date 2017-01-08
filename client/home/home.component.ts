import {Component, OnInit, ElementRef} from "@angular/core";
import {JwtHelper} from 'angular2-jwt';
import {UserServices} from "../services/user.services";
import {Router} from "@angular/router";

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
    private user;
    name: string;
    image;
    jwt: JwtHelper;
    private google;

    constructor(private userservices: UserServices, public element: ElementRef,
                private router: Router){
        this.google = element.nativeElement.getElementsByClassName('google');
        console.log(this.google);
    }

    ngOnInit(){
        this.jwt = new JwtHelper();
        this.user = this.jwt.decodeToken(localStorage.getItem('auth_token'));
        this.user = this.user.user;
        this.image = "data:image/png;base64," + this.user.image;
        console.log(this.user);
        this.name = this.user.userName;
    }

    onLogout(){
        localStorage.clear();
        this.router.navigate(['/auth']);
    }

    getImage(){
        return this.user.image;
    }
}

export {BrowseComponent} from "./browse/browse.component";

export {MainComponent} from "./main/main.component";

export {MemberComponent} from "./member/member.component";

export {ProfileComponent} from "./profile/profile.component";

export {SearchComponent} from "./search/search.component";