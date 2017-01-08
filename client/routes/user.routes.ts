import {Routes} from "@angular/router";
import {SignInComponent, SignUpComponent} from "../user/user.component";
import {LoggedInGuard2} from "../services/loggeIn.guard";

export const USER_ROUTES: Routes = [
    {path: '', redirectTo: 'signin', pathMatch: 'full'},
    {path: 'signin', component: SignInComponent, canActivate: [LoggedInGuard2]},
    {path: 'signup', component: SignUpComponent, canActivate: [LoggedInGuard2]},
    {path: '**', redirectTo: 'signin'}
];