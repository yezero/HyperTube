import {Component} from "@angular/core";
import {UserServices} from "../../../services/user.services";

@Component({
    selector: 'my-fav',
    templateUrl: './fav.component.html',
    styleUrls: ['./fav.component.css']
})
export class FavComponent{
    private user;

    constructor(private userservices: UserServices){
        this.user = this.userservices.getUser();
    }

    onRemove(index){
        console.log(index);
        this.user.favList.splice(index, 1);
        this.onSave();
    }

    onSave(){
        console.log(this.user.favList.length);
        this.userservices.savedetails(this.user)
            .subscribe();
    }
}