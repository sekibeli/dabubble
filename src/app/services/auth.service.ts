import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, collectionData, doc, docData, getDoc, onSnapshot } from '@angular/fire/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.class';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userUID;
  public currentUser;
  
  firestore: Firestore = inject(Firestore);
  // public currentUser: Observable<any>;
  // private currentUserSubject: BehaviorSubject<any>;
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
       this.currentUser = result.user;
       console.log('UserID-innerhalb:', this.userUID);
       console.log('User-innerhalb:', this.currentUser);
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
      if(result.user){
        console.log(result.user.uid);
       this.userUID = result.user.uid;
       console.log('UserID-innerhalb:', this.userUID);
      }
         else {
          console.error('sorry, kein User da');
         }  
         }) .catch(error => {
          console.error(error);
        });
  }
 
   getCurrentUser(id:string){
   
    const collRef = collection(this.firestore, 'users');
   const collData = doc(collRef, id);


    onSnapshot(collData, (user) => {
      console.log('current', user);
      if (user.exists()) {
        this.currentUser = new User(user.data());
        console.log(this.currentUser);
      } else {
        console.log('User nicht vorhanden!');
      }
    });

    
  
  }

}
 