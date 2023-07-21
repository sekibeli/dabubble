import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userUID;
  firestore: Firestore = inject(Firestore);
  public currentUser: Observable<any>;
  private currentUserSubject: BehaviorSubject<any>;
//  userLoggedIn_UID;
//  userLoggedIn;

  constructor(private afs: AngularFireAuth) {
   
   }


  signinWithGoogle(){
    return this.afs.signInWithPopup(new GoogleAuthProvider())
    
    .then(result => {
      if(result.user){
        console.log(result.user.uid);
       this.userUID = result.user.uid;
       console.log('UserID-innerhalb:', this.userUID);
      }
         else {
          console.error('sorry, kein User da');
         }  
    })
    .catch(error => {
      console.error(error);
    });

   
  }

  registerWithEmailAndPassword(user: {email: string, password: string}){
   return this.afs.createUserWithEmailAndPassword(user.email, user.password)
   
   ;
  }


  loginWithEmailAndPassword(user: {email: string, password: string}){
    return this.afs.signInWithEmailAndPassword(user.email, user.password).then(result => {
      console.log(result.user);
      
         });
  }
 

}
 