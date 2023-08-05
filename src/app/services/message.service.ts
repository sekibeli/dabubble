import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, and, collection, collectionData, or, orderBy, query, where } from '@angular/fire/firestore';
import { Message } from '../models/message.class';

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


  async getThisChat(toID) {
    //  localStorage.setItem('currentChatID', toID);
    const collRef1 = query(collection(this.firestore, 'messages'), where('fromID', '==', this.currentUserID), where('toID', '==', toID));
    const collRef2 = query(collection(this.firestore, 'messages'), where('fromID', '==', toID), where('toID', '==', this.currentUserID));


    const docRef1 = await collectionData(collRef1);
    const docRef2 = await collectionData(collRef2);

    const docRef = {
      docRef1: docRef1,
      docRef2: docRef2
    }

    return docRef;

  }

  getChatToDetails(toID) {
    localStorage.setItem('currentChatID', toID);
  }

  saveMessage(description) {

    this.message = new Message(
      {
        id: '',
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

