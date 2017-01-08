import {Component, OnInit} from "@angular/core";
import {FormGroup, Validators, FormControl, NgForm} from '@angular/forms';
import {Router} from "@angular/router";
import {UserServices} from "../../services/user.services";
import {Http} from "@angular/http";

@Component({
    selector: 'my-signin',
    templateUrl: './in.component.html',
    styleUrls: ['./in.component.css']
})
export class SignInComponent implements OnInit{
    myForm: FormGroup;
    error: boolean = false;
    errorMsg: string = null;

    constructor(private router: Router, private userservices: UserServices, private http: Http){
        this.errorMsg = null;
        this.error = false;
    }

    ngOnInit(){
        this.error = this.userservices.apiAuth;
        this.errorMsg = this.userservices.apiMsg;
        let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern(emailRegex)
            ]),
            password: new FormControl(null, Validators.required)
        })
    }

    onSubmit(form: NgForm){
        this.errorMsg = null;
        this.error = false;
        console.log("user signing");
        this.userservices.signin(form.value.email, form.value.password)
            .subscribe(
                data => {
                    this.router.navigate(['/home']);
                },
                error => {
                    this.error = true;
                    this.errorMsg = "Invalid login details";
                }
            );
        form.reset();
    }

    fbLogin(){
        window.name = "win1";
        console.log(window.name);
        let newWin = open('','','height=800,width=800');
        newWin.location.href = "http://localhost:4000/auth/facebook";
    }

    wtcLogin(){
        window.name = "win1";
        console.log(window.name);
        let newWin = open('','','height=800,width=800');
        newWin.location.href = "http://localhost:4000/auth/42";
    }
}