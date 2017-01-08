import {Component} from "@angular/core";
import {UserServices} from "../../../services/user.services";

@Component({
    selector: 'my-watch',
    templateUrl: './watch.component.html',
    styleUrls: ['./watch.component.css']
})

export class WatchComponent{
    private user;

    constructor(private userservices: UserServices){
        this.user = this.userservices.getUser();
    }

    onRemove(index){
        console.log(index);
        this.user.watchList.splice(index, 1);
        this.onSave();
    }

    onSave(){
        console.log(this.user.watchList.length);
        this.userservices.savedetails(this.user)
            .subscribe();
    }
}