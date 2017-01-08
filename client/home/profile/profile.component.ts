import {Component} from "@angular/core";
import {UserServices} from "../../services/user.services";

@Component({
    selector: 'my-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
    title = "Details";
    private user;

    constructor(private userservices: UserServices){
        this.user = this.userservices.getUser();
    }
}

export {DetailsComponent} from "./details/details.component"

export {PrivacyComponent}  from "./privacy/privacy.component";

export {FavComponent} from "./favs/fav.component";

export {WatchComponent} from "./watchlist/watch.component";