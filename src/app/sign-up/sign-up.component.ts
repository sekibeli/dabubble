import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  passwordControl: FormControl = new FormControl('', Validators.required);
  hide = true;
  hideConfirmPassword = true;

  constructor(public auth: AuthService, private route: Router){}

  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  })

  loginWithGoogle(){}

  registerWithEmailAndPassword(){
    console.log(this.signUpForm.value);
    const userData = Object.assign({email: this.signUpForm.value.username}, this.signUpForm.value);
    console.log(userData);
    this.auth.registerWithEmailAndPassword(userData).then((result: any) => {
      this.route.navigateByUrl('home');
        }).catch( (error: any) => {
          console.error(error);
        })  ;
    
  }

}
