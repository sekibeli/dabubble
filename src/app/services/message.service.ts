import { Injectable, inject } from '@angular/core';
import { Firestore, and, collection, collectionData, or, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
firestore: Firestore = inject(Firestore);
currentUserID;
  constructor() {
this.currentUserID = localStorage.getItem('currentUserID');
   }


  async getThisChat(toID){
    let id = this.currentUserID;
    const collRef1 = query(collection( this.firestore, 'messages'), where ('fromID' ,'==' , this.currentUserID), where ('toID', '==', toID)) ;
    const collRef2 = query(collection( this.firestore, 'messages'), where ('fromID' ,'==' , toID), where ('toID', '==', this.currentUserID)) ;
   
    const docRef1 = await collectionData(collRef1);
    const docRef2 = await collectionData(collRef2);
  
    const docRef = {
      docRef1: docRef1,
      docRef2: docRef2
    }
    return  docRef;

  }
}
