import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  error = true;
  hide = true;
  user: User;
  firestore: Firestore = inject(Firestore);
  constructor(public auth: AuthService, private route: Router) { }
  passwordControl: FormControl = new FormControl('', Validators.required);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, this.emailFormatValidator()]),
    password: new FormControl('', Validators.required)
  })



  loginWithGoogle() {
    const userData = Object.assign({ email: this.loginForm.value.username }, this.loginForm.value);
    this.auth.signinWithGoogle();
    // .then((result: any) => {
    //   if (result && result.user) {
    //     const collRef = doc(this.firestore, 'users', result.user.uid);


    //     if (result.additionalUserInfo.isNewUser) {
    //       this.user = new User({
    //         id: result.user.uid,
    //         username: result.additionalUserInfo.profile['name'],
    //         email: result.user.email,
    //         img: result.additionalUserInfo.profile.picture,
    //         active: true
    //       })

    //       setDoc(collRef, this.user.toJSON());
    //       localStorage.setItem('directMessage', 'false');
    //     }
    //   } else {
    //     localStorage.setItem('directMessage', 'false');
    //   }
    //   setTimeout(() => {
    //     this.route.navigateByUrl('home/channel/BwYu94QGYDi8hQta31RP');
    //   }, 1000);

    // }).catch((error) => {
    //   console.error('Hier ist der Fehler: ', error)
    // });
  }


  loginWithEmailAndPassword() {
    const userData = Object.assign({ email: this.loginForm.value.username }, this.loginForm.value);
    this.auth.loginWithEmailAndPassword(userData)

  }

  emailFormatValidator(): ValidatorFn {
    return (control: FormControl) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValid = emailPattern.test(control.value);
      return isValid ? null : { invalidEmailFormat: true };
    };
  }

  loginAsGuest() {

    this.loginForm.controls['email'].setValue('gast@gast.de');
    this.loginForm.controls['password'].setValue('jWq7cE6E9ir8bV@');
    const userData = Object.assign({ email: this.loginForm.value.username }, this.loginForm.value);
    this.auth.loginWithEmailAndPassword(userData).then((result: any) => {
      localStorage.setItem('directMessage', 'false');


      setTimeout(() => {
        this.route.navigateByUrl('home/channel/BwYu94QGYDi8hQta31RP');
      }, 1000);

    }).catch((error: any) => {
      // console.log(error);
    });
  }



}


