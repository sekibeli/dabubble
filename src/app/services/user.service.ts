import { EventEmitter, Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.class';

// Service
// • für den Abruf der Daten von allen Usern aus Firestore

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  firestore: Firestore = inject(Firestore);
  users!: Observable<User>;
  observeUsers: Observable<any>;
  //  activeChatUser = new EventEmitter<User>();
  // user;

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


  getAuthorDetails(post) {
    const userDataRef = this.getCurrentUser(post['author']).subscribe((value) => {

      return value;
    });
  }


  async setUserStatus(id, status) {
    console.log('id:', id);
    try {
      const docRef = doc(this.firestore, 'users', id);

      await updateDoc(docRef,
        {
          active: status,
        });
    } catch (error) {
      console.error('Fehler: ', error);
    }
  }

  

}
