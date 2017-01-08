import {Component} from "@angular/core";
import {UserServices} from "../../../services/user.services";

@Component({
    selector: 'my-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})

export class DetailsComponent{
    private user;
    edit: string = null;

    constructor(private userservices: UserServices){
        this.user = this.userservices.getUser();
    }

    editClick(type: string){
        this.edit = type;
    }

    editCancel(){
        this.edit = null;
    }

    editSave(type: string, val){
        if (type === "userName"){
            this.user.userName = val.value;
        }else if (type == "firstName"){
            this.user.firstName = val.value;
        }else if (type === "lastName"){
            this.user.lastName = val.value;
        }else if (type === "email"){
            this.user.email = val.value;
        }else if (type == "country"){
            this.user.country = val.value;
        }else if (type === "bio"){
            this.user.bio = val.value;
        }
        this.edit = null;
    }

    onSave(){
        this.userservices.savedetails(this.user)
            .subscribe(
                res => {
                    console.log("from save");
                    console.log(res);
                },
                error => {
                    console.log(error);
                }
            );
    }
}