import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
        // console.log(result);
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
      }
    } else {
      console.log('keine Neuanlage');
    }

    }).catch((error)=> {
      console.error('Hier ist der Fehler: ', error)
    });

   setTimeout(()=> {this.route.navigateByUrl('home/channel/9Gwz1Ce763caWx5FCBZL');},1000); 

  }

  loginWithEmailAndPassword() {
    console.log(this.loginForm.value);
    const userData = Object.assign({ email: this.loginForm.value.username }, this.loginForm.value);
    console.log(userData);
    this.auth.loginWithEmailAndPassword(userData).then((result: any) => {

      this.route.navigateByUrl('home/channel/9Gwz1Ce763caWx5FCBZL');
    }).catch((error: any) => {
      console.error(error);
    });

  }
}