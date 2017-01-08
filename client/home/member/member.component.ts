import {Component} from "@angular/core";
import {UserServices} from "../../services/user.services";

@Component({
    selector: 'my-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.css']
})
export class MemberComponent {
    private users;
    displayUser: boolean = false;
    disUser;

    constructor(private userservices: UserServices){
        this.userservices.getUsers()
            .subscribe(
                response => {
                    console.log(response);
                    this.users = response.users;
                },
                error => {
                    console.log("error");
                    console.log(error);
                }
            );
    }

    onView(user){
        this.displayUser = true;
        this.disUser = user;
    }

    onBack(){
        this.displayUser = false;
        this.disUser = null;
    }
}