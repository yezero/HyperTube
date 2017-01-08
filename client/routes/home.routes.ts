import {Routes} from "@angular/router";
import {BrowseComponent, MainComponent, SearchComponent,
    MemberComponent, ProfileComponent} from "../home/home.component";
import {PROFILE_ROUTES} from "./profile.routes";
import {MovieComponent} from "../movies/movie.component";
import {StreamComponent} from "../stream/stream.component";

export const HOME_ROUTES: Routes = [
    {path: '', redirectTo: 'main', pathMatch: 'full'},
    {path: 'browse', component: BrowseComponent},
    {path: 'main', component: MainComponent},
    {path: 'members', component: MemberComponent},
    {path: 'profile', component: ProfileComponent, children: PROFILE_ROUTES},
    {path: 'search', component: SearchComponent},
    {path: 'movie/:id/:type', component: MovieComponent},
    {path: 'stream/:id/:type/:name', component: StreamComponent},
    {path: '**', redirectTo: 'main'}
];