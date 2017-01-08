import {HomeComponent} from "../home/home.component";
import {UserComponent} from "../user/user.component";
import {LoggedInGuard} from "../services/loggeIn.guard";
import {Routes} from "@angular/router";
import {USER_ROUTES} from "./user.routes";
import {HOME_ROUTES} from "./home.routes";
import {FbApiComponent} from "../apis/fbApi/fb.component";
import {WtcApiComponent} from  "../apis/42api/42.component";

export const mainRoutes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, children: HOME_ROUTES, canActivate: [LoggedInGuard]},
    {path: 'auth', component: UserComponent, children: USER_ROUTES},
    {path: 'fbAuth', component: FbApiComponent},
    {path: 'wtcAuth', component: WtcApiComponent},
    {path: '**', redirectTo: 'home'}
];