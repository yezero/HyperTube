import {Component, OnInit} from "@angular/core";
import {FormGroup, Validators, FormControl, NgForm} from '@angular/forms';
import {UserServices} from "../../services/user.services";

@Component({
    selector: 'my-signup',
    templateUrl:'./up.component.html',
    styleUrls: ['./up.component.css']
})
export class SignUpComponent implements OnInit{
    myForm: FormGroup;
    error: boolean = false;
    errorMsg: string = null;
    success: boolean = false;
    successMsg: string = null;

    constructor(private userservices: UserServices){
        this.errorMsg = null;
        this.error = false;
        this.success = false;
        this.successMsg = null;
    }

    ngOnInit(){
        let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

        this.myForm = new FormGroup({
            userName: new FormControl(null, Validators.required),
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern(emailRegex)
            ]),
            password: new FormControl(null, Validators.required),
            rePassword: new FormControl(null, Validators.required)
        })
    }

    onSubmit(form: NgForm){
        this.errorMsg = null;
        this.error = false;
        this.success = false;
        this.successMsg = null;
        if (form.value.password !== form.value.rePassword){
            this.error = true;
            this.errorMsg = "Password don't match";
            return ;
        }
        this.userservices.signup(
            form.value.userName,
            form.value.firstName,
            form.value.lastName,
            form.value.email,
            form.value.password
        ).subscribe(
            data => {
                this.success = true;
                this.successMsg = "Account created successfully";
            },
            error => {
                this.error = true;
                if (error.error.errors.email)
                    this.errorMsg = "Email already exist";
                else
                    this.errorMsg = "Account creation failed";
            }
        );
        form.reset();

    }
}