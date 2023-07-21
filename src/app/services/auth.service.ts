import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

username = '';
  constructor(private afs: AngularFireAuth) { }


  signinWithGoogle(){
    return this.afs.signInWithPopup(new GoogleAuthProvider())
  }

  registerWithEmailAndPassword(user: {email: string, password: string}){
   return this.afs.createUserWithEmailAndPassword(user.email, user.password);
  }



  loginWithEmailAndPassword(user: {email: string, password: string}){
    return this.afs.signInWithEmailAndPassword(user.email, user.password).then(result => {
      console.log(result.user);
      console.log('username: ' ,this.username);
         });
  }


  
  
  

}
 