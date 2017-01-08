import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from '@angular/router';
import {HttpModule} from "@angular/http";
import {JwtHelper, AUTH_PROVIDERS} from 'angular2-jwt';
//my imports
import {UserComponent, SignInComponent, SignUpComponent} from "../user/user.component";
import {AppComponent} from "./app.component";
import {HomeComponent, BrowseComponent, ProfileComponent,
        MainComponent, MemberComponent, SearchComponent} from "../home/home.component";
import {mainRoutes} from "../routes/app.routes";
import {UserServices} from "../services/user.services";
import {LoggedInGuard, LoggedInGuard2} from "../services/loggeIn.guard";
import {Base64ImageService} from "../services/image64.services";
import {MovieServices} from "../services/movie.services";
import {FbApiComponent} from "../apis/fbApi/fb.component";
import {WtcApiComponent} from "../apis/42api/42.component";
import {DetailsComponent, PrivacyComponent,
    FavComponent, WatchComponent} from "../home/profile/profile.component";
import {MovieComponent} from "../movies/movie.component";
import {StreamComponent} from "../stream/stream.component";

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        SignUpComponent,
        SignInComponent,
        HomeComponent, BrowseComponent,
        MainComponent, MemberComponent,
        ProfileComponent, SearchComponent,
        FbApiComponent, WtcApiComponent,
        DetailsComponent, PrivacyComponent,
        FavComponent, WatchComponent,
        MovieComponent, StreamComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(mainRoutes),
        HttpModule
    ],
    bootstrap: [AppComponent],
    providers: [
        UserServices,
        LoggedInGuard, LoggedInGuard2,
        Base64ImageService,
        JwtHelper, AUTH_PROVIDERS,
        MovieServices
    ]
})
export class AppModule{

}