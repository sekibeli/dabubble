import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, and, collection, collectionData, or, orderBy, query, where } from '@angular/fire/firestore';
import { Message } from '../models/message.class';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  firestore: Firestore = inject(Firestore);
  currentUserID;
  message: Message;

  constructor() {
    this.currentUserID = localStorage.getItem('currentUserID');
    console.log(this.currentUserID);
  }


 getThisChat(toID) {
     localStorage.setItem('currentChatID', toID);
    const collRef = query(collection(this.firestore, 'messages'), where('fromID', 'in', [this.currentUserID, toID]), where('toID', 'in', [toID, this.currentUserID]));
    const collRefOrdered = query(collRef,  orderBy('timestamp'));
   
    const docRef = collectionData(collRefOrdered);
    
    return docRef;

  }

  getChatToDetails(toID) {
    localStorage.setItem('currentChatID', toID);
  }


//   async getThisChat(toID) {
//     localStorage.setItem('currentChatID', toID);
//    const collRef1 = query(collection(this.firestore, 'messages'), where('fromID', '==', this.currentUserID), where('toID', '==', toID));
//    const collRef2 = query(collection(this.firestore, 'messages'), where('fromID', '==', toID), where('toID', '==', this.currentUserID));


//    const docRef1 =  collectionData(collRef1);
//    const docRef2 =  collectionData(collRef2);

//   //  const docRef = {
//   //    docRef1: docRef1,
//   //    docRef2: docRef2
//   //  }

//   const docRef = await Promise.all([docRef1, docRef2]);
//   console.log(docRef);
//    return from(docRef);

//  }

  saveMessage(description) {

    this.message = new Message(
      {
        fromID: localStorage.getItem('currentUserID'),
        toID: localStorage.getItem('currentChatID'),
        description: description,
        timestamp: new Date().getTime()
      }
    );

    console.log('Message:', this.message);

    const collDocRef = collection(this.firestore, 'messages');
    addDoc(collDocRef, this.message.toJSON()).then((result) => {

      console.log('Anlage erfolgreich')
    }).catch((error) => {
      console.log(error);
    });
  }



}

