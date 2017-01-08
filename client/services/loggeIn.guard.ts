import {Injectable} from "@angular/core";
import {UserServices} from "./user.services";
import {CanActivate, Router} from "@angular/router";

@Injectable()
export class LoggedInGuard implements CanActivate{
    constructor(private userServices: UserServices, private router: Router){}

    canActivate(){
        if (this.userServices.isLoggedIn()){
            return true;
        }
        this.router.navigateByUrl('/auth');
        return false;
    }
}

@Injectable()
export class LoggedInGuard2 implements CanActivate{
    constructor(private userServices: UserServices, private router: Router){}

    canActivate(){
        if (!this.userServices.isLoggedIn()){
            return true;
        }
        this.router.navigateByUrl('/home');
        return false;
    }
}