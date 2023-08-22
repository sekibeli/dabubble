import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { getAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
// aut = getAuth();
error = true;
// errormessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  hide = true;
  user: User;
  firestore: Firestore = inject(Firestore);
  constructor(public auth: AuthService, private route: Router) { }
  passwordControl: FormControl = new FormControl('', Validators.required);
 
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  loginWithGoogle() {
    const userData = Object.assign({ email: this.loginForm.value.username }, this.loginForm.value);
    this.auth.signinWithGoogle().then((result: any) => {
      if(result && result.user){
      const collRef = doc(this.firestore, 'users', result.user.uid);
        console.log('....->', result.user.uid);
        // console.log(result.additionalUserInfo.isNewUser);

      if (result.additionalUserInfo.isNewUser) {
        this.user = new User({
          id: result.user.uid,
          username: result.additionalUserInfo.profile['name'],
          email: result.user.email,
          img: result.additionalUserInfo.profile.picture,
          active: true
        })

        setDoc(collRef, this.user.toJSON());
        localStorage.setItem('directMessage', 'false');
      }
    } else {
      console.log('keine Neuanlage');
      localStorage.setItem('directMessage', 'false');
    }

    }).catch((error)=> {
      console.error('Hier ist der Fehler: ', error)
    });

  
setTimeout(() => {
   this.route.navigateByUrl('home/channel/BwYu94QGYDi8hQta31RP');
}, 4000);
  }

  loginWithEmailAndPassword() {

    console.log(this.loginForm.value);
    const userData = Object.assign( { email: this.loginForm.value.username }, this.loginForm.value);
    console.log('USERDATA:', userData);
    this.auth.loginWithEmailAndPassword(userData)
    
    // .then((result: any) => {
    //   localStorage.setItem('directMessage', 'false');
    //   console.log('login erfolgreich', result)


    // }).catch((error: any) => {
    //   console.error(error);
     
    // });

  }

  // logUserOut(aut){
  //   this.auth.logUserOut(aut);
  // }


  loginAsGuest(){

    this.loginForm.controls['email'].setValue('gast@gast.de');
    this.loginForm.controls['password'].setValue('jWq7cE6E9ir8bV@');
    console.log(this.loginForm.value);
    const userData = Object.assign( { email: this.loginForm.value.username }, this.loginForm.value);
    console.log('USERDATA:', userData);
    this.auth.loginWithEmailAndPassword(userData).then((result: any) => {
      localStorage.setItem('directMessage', 'false');

      
setTimeout(() => {
  this.route.navigateByUrl('home/channel/BwYu94QGYDi8hQta31RP');
}, 2000);

    }).catch((error: any) => {
      console.error(error);
    });
  }
}


