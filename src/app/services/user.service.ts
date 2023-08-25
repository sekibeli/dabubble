import { EventEmitter, Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, limit, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user.class';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';

// Service
// • für den Abruf der Daten von allen Usern aus Firestore

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  firestore: Firestore = inject(Firestore);
  users!: Observable<User>;
  observeUsers: Observable<any>;
  startAt = new Subject();
endAt = new Subject();

  constructor() {
    this.getUserData();
  }

  ngOnInit() {

  }

  getUserData() {
    const collRef = collection(this.firestore, 'users');
    const userData = collectionData(collRef);
    return userData;
  }


  getCurrentUser(id: string) {
   
    const docRef = doc(this.firestore, 'users', id);
    return docData(docRef);

  }

  getUserByEmail(email: string){
    const colRef = collection(this.firestore, 'users');
    const docRef = query((colRef), where('email', '==', email));
    console.log(docRef);
  }

  getAuthorDetails(post) {
    const userDataRef = this.getCurrentUser(post['author']).subscribe((value) => {
      return value;
    });
  }


  async setUserStatus(id, status) {
   
    try {
      const docRef = doc(this.firestore, 'users', id);
      console.log('id', id);
      console.log('status für logout', status);

      await updateDoc(docRef,
        {
          active: status,
        }); return true;
    } catch (error) {
      console.error('Fehler: ', error);
      return false;
    }
  }

  async setUserName(id, username) {
    console.log('id:', id);
    try {
      const docRef = doc(this.firestore, 'users', id);

      await updateDoc(docRef,
        {
          username: username,
        });
        
    } catch (error) {
      console.error('Fehler: ', error);
    }
  }

  async saveUserPic(id, image, avatar){
    console.log('id:', id);
    try {
      const docRef = doc(this.firestore, 'users', id);
if(avatar){ await updateDoc(docRef,
  { 
    img: '../../assets/img/profile_img/'+ image,
  });} else {
    await updateDoc(docRef,
      { 
        img: image,
      });
  }
     
    } catch (error) {
      console.error('Fehler: ', error);
    }
  }
 

  // searchUserInFirestore(start, end){
  //   const collRef = collection(this.firestore, 'users');
  //  return  query(collRef, limit(4), orderBy('username'), startAt(start), this.endAt(end));

  // }

  

}
