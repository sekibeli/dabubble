import { Injectable, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, collectionData, doc, docData, getDoc, onSnapshot } from '@angular/fire/firestore';
import { GoogleAuthProvider, signOut } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.class';
import { ChannelService } from './channel.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackComponent } from '../snackbar/snack/snack.component';
import { Router } from '@angular/router';
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";


// Service 
// • für die Anmeldung des Users
// • für die Speicherung der Daten des angemeldeten Users

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  errormessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
 result;
  public userUID: string; //String mit der ID
  public currentUser; // User mit allen Eigenschaften

  firestore: Firestore = inject(Firestore);

  constructor(private afs: AngularFireAuth, private channelService: ChannelService, private snackbar: MatSnackBar, private route: Router) { 
    const auth = getAuth();
  setPersistence(auth, browserSessionPersistence).catch(error => {
    console.error("Fehler bei der Konfiguration der Authentifizierungspersistenz", error);
  });
  }

  ngOnInit() { }

  async signinWithGoogle() {
   return await this.afs.signInWithPopup(new GoogleAuthProvider())

      .then(result => {

        console.log('result user aus authService: ', result.user);
        this.userUID = result.user.uid;
        this.currentUser = result.user;
        console.log('Eingeloggter User:', this.userUID);
        this.saveCurrentUserIDInLocalStorage(this.userUID);
        this.pushNewUserInAllgemeinChannel(this.userUID);
        // this.showMessage('Konto erfolgreich erstellt!');
      })
      .catch(error => {
        console.error(error);
      });
  }

  registerWithEmailAndPassword(user: { email: string, password: string }) {

    return this.afs.createUserWithEmailAndPassword(user.email, user.password);
  }

  loginWithEmailAndPassword( user: { email: string, password: string }) {
    return this.afs.signInWithEmailAndPassword(user.email, user.password).then(result => {
console.log(result);
      this.userUID = result.user.uid;
      console.log('Eingeloggter User:', this.userUID);
      this.saveCurrentUserIDInLocalStorage(this.userUID);
      this.pushNewUserInAllgemeinChannel(this.userUID);
      localStorage.setItem('directMessage', 'false');
      setTimeout(() => {
        this.route.navigateByUrl('home/channel/BwYu94QGYDi8hQta31RP');
      }, 2000);

    }).catch(error => {
      // console.error(error);

      switch (error.code) {
        case 'auth/wrong-password':
            // console.error('Falsches Passwort eingegeben.');
            this.errormessage.next('Falsches Passwort eingegeben.');
            setTimeout(() => {
              this.errormessage.next('');
            }, 5000);
            // Hier können Sie auch eine Benachrichtigung oder einen Toast anzeigen, 
            // um den Benutzer über den Fehler zu informieren.
            break;
        case 'auth/user-not-found':
            // console.error('Kein Benutzer mit dieser E-Mail-Adresse gefunden.');
            this.errormessage.next('Kein Benutzer mit dieser E-Mail-Adresse bekannt.');
            setTimeout(() => {
              this.errormessage.next('');
            }, 5000);
            break;
        // ... Sie können hier weitere Fehlercodes hinzufügen und behandeln ...

        default:
            // console.error('Ein unbekannter Fehler ist aufgetreten:', error);
            setTimeout(() => {
              this.errormessage.next('');
            }, 5000);
    }
    
    });
  }

  

  saveCurrentUserIDInLocalStorage(id: string) {
       localStorage.setItem('currentUserID', id);
  }

   getCurrentUserIDFromLocalStorage(){
  return localStorage.getItem('currentUserID');
   
  }

pushNewUserInAllgemeinChannel(newUser){
  this.channelService.addMemberToChannel('BwYu94QGYDi8hQta31RP', newUser);
}

showMessage(message){
  const config = new MatSnackBarConfig();
  config.data = message;
  config.duration = 3000;
  config.verticalPosition = 'bottom';
  config.horizontalPosition = 'right';
this.snackbar.openFromComponent(SnackComponent, config);
}

}
