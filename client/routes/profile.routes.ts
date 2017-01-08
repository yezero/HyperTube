import {Routes} from "@angular/router";
import {DetailsComponent, PrivacyComponent,
        FavComponent, WatchComponent} from "../home/profile/profile.component";

export const PROFILE_ROUTES: Routes = [
    {path: '', redirectTo: 'details', pathMatch: 'full'},
    {path: 'details', component: DetailsComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path:'favs', component: FavComponent},
    {path: 'watch', component: WatchComponent},
    {path: '**', redirectTo: 'details'}
];