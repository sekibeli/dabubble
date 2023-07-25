import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.class';

// Service
// • für den Abruf der Daten von allen Usern aus Firestore

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
  firestore: Firestore = inject(Firestore);
 users!: Observable<User>;
 observeUsers: Observable<any>;
// user;

  constructor() {
   this.getUserData();
   }

  ngOnInit(){
   
  }
  
  getUserData(){
    const collRef = collection(this.firestore, 'users');
    const userData = collectionData(collRef);
    return userData;
      }

   async getCurrentUser(id:string){
    const docRef = await doc(this.firestore, 'users', id);
    return docData(docRef);
  
   }
}