import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
  firestore: Firestore = inject(Firestore);
// users!: Observable<any>;
// user;

  constructor() {
   this.getUserData();
   }

  ngOnInit(){
   
  }
  
  getUserData(): Observable<any>{
    const collRef = collection(this.firestore, 'users');
    const userData = collectionData(collRef);
    return userData;
      }

   
}
