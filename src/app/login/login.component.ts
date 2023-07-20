import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  firestore: Firestore = inject(Firestore);
  constructor(public auth: AuthService, private route: Router){}
  passwordControl: FormControl = new FormControl('', Validators.required);
  hide = true;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  loginWithGoogle(){}

  loginWithEmailAndPassword(){
    console.log(this.loginForm.value);
    const userData = Object.assign({email: this.loginForm.value.username}, this.loginForm.value);
    console.log(userData);
    this.auth.loginWithEmailAndPassword(userData).then((result: any) => {

      this.route.navigateByUrl('home');
        }).catch( (error: any) => {
          console.error(error);
        })  ;
    
  }
}
