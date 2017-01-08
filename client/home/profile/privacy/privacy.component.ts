import {Component} from "@angular/core";
import {UserServices} from "../../../services/user.services";

@Component({
    selector: 'my-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent{
    private user;

    constructor(private userserivecs: UserServices){
      this.user = this.userserivecs.getUser();
    }

    onSave(watch, fav, recent){
        this.user.favView = fav.checked;
        this.user.watchView = watch.checked;
        this.user.recentView = recent.checked;
        console.log(this.user.favView);
        console.log(this.user.watchView);
        console.log(this.user.recentView);
        this.userserivecs.savedetails(this.user)
            .subscribe(
                res => {
                    console.log(res);
                },
                error => {
                    console.log(error);
                }
            );
    }
}