import {Component} from "@angular/core";

@Component({
    selector: 'my-user-app',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent{
}

export {SignInComponent} from "./signIn/in.component";
export {SignUpComponent} from "./signUp/up.component";