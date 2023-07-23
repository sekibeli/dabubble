import { Injectable, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, collectionData, doc, docData, getDoc, onSnapshot } from '@angular/fire/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.class';

// Service 
// • für die Anmeldung des Users
// • für die Speicherung der Daten des angemeldeten Users

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  public userUID: string; //String mit der ID
  public currentUser; // User mit allen Eigenschaften

  firestore: Firestore = inject(Firestore);

  constructor(private afs: AngularFireAuth) { }

  ngOnInit() { }

  async signinWithGoogle() {
    await this.afs.signInWithPopup(new GoogleAuthProvider())

      .then(result => {

        console.log('result user aus authService: ', result.user);
        this.userUID = result.user.uid;
        this.currentUser = result.user;
        console.log('Eingeloggter User:', this.userUID);
        this.saveCurrentUserIDInLocalStorage(this.userUID);
      })
      .catch(error => {
        console.error(error);
      });
  }

  registerWithEmailAndPassword(user: { email: string, password: string }) {
    return this.afs.createUserWithEmailAndPassword(user.email, user.password);
  }

  loginWithEmailAndPassword(user: { email: string, password: string }) {
    return this.afs.signInWithEmailAndPassword(user.email, user.password).then(result => {

      this.userUID = result.user.uid;
      console.log('Eingeloggter User:', this.userUID);
      this.saveCurrentUserIDInLocalStorage(this.userUID);

    }).catch(error => {
      console.error(error);
    });
  }

  /**
   * 
   * @param id uid vom gerade eingeloggten User
   * Ruft mit der uid die dazugehörigen User-Daten vom Firestore ab
   */
  // getCurrentUser(id: string) {
  //   const collRef = collection(this.firestore, 'users');
  //   const collData = doc(collRef, id);

  //   docData(collData).subscribe(data => {
  //     this.currentUser = data;
    
  //   }, error => {
  //     console.log('Fehler', error);
  //   });

  //   return docData(collData);
  // }

  saveCurrentUserIDInLocalStorage(id: string) {
       localStorage.setItem('currentUserID', id);
  }

   getCurrentUserIDFromLocalStorage(){
  return localStorage.getItem('currentUserID');
   
  }

}
