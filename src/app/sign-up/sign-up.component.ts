import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  user: User;
  firestore: Firestore = inject(Firestore);
  passwordControl: FormControl = new FormControl('', Validators.required);
  hide = true;
  hideConfirmPassword = true;

  constructor(public auth: AuthService, private route: Router) { }

  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email, this.emailFormatValidator()]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required)
  })

  emailFormatValidator(): ValidatorFn {
    return (control: FormControl) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValid = emailPattern.test(control.value);
      return isValid ? null : { invalidEmailFormat: true };
    };
  }
  
  registerWithEmailAndPassword() {
    // console.log(this.signUpForm.value);
    const userData = Object.assign({ email: this.signUpForm.value.username }, this.signUpForm.value);
    // console.log(userData);
    this.auth.registerWithEmailAndPassword(userData).then((result: any) => {

      const collRef = doc(this.firestore, 'users', result.user.uid);

      this.user = new User({
        id: result.user.uid,
        username: userData.name,
        email: userData.email,
        img: '../../assets/img/profile_img/benutzer.png',
        active: true
      })

      setDoc(collRef, this.user.toJSON());

      localStorage.setItem('currentUserID', result.user.uid);

      this.route.navigateByUrl('avatar');
      // console.log(result);
    }).catch((error: any) => {
      // console.error(error);
    });
  }
}
