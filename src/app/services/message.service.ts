import { EventEmitter, Injectable, inject } from '@angular/core';
import { Firestore, addDoc, and, collection, collectionData, doc, or, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { Message } from '../models/message.class';
import { BehaviorSubject, from } from 'rxjs';
import { User } from '../models/user.class';
import { UserService } from './user.service';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  firestore: Firestore = inject(Firestore);
  currentUserID;
  message: Message;
  private lastDate: string;
  activeChatUser = new EventEmitter();
  chatLengthEmitter = new EventEmitter();

  constructor(public userService: UserService) {
    this.currentUserID = localStorage.getItem('currentUserID');
    console.log(this.currentUserID);
    const currentUser = JSON.parse(localStorage.getItem('currentChatUser'));

  }


  getThisChat(toID) {
    this.setCurrentChatInformationInLocalStorage(toID);
    const from = localStorage.getItem('currentUserID');
    const to = localStorage.getItem('currentChatID');
    if (from === to) {
      console.log('von:', from, 'zu:', to);
      const collRef = query(collection(this.firestore, 'messages', from, 'mess'), where('fromID', '==', this.currentUserID));
      const collRefOrdered = query(collRef, orderBy('timestamp'));
      const docRef = collectionData(collRefOrdered);

      return docRef;
    } else {
      const collRef = query(collection(this.firestore, 'messages'), where('fromID', 'in', [this.currentUserID, toID]), where('toID', 'in', [toID, this.currentUserID]));
      const collRefOrdered = query(collRef, orderBy('timestamp'));
      const docRef = collectionData(collRefOrdered);

      return docRef;
    }





  }


  setCurrentChatInformationInLocalStorage(toID) {
    localStorage.setItem('currentChatID', toID);

  }

  setChatUser(user) {
    localStorage.setItem('currentChatUser', JSON.stringify(user));
  }

  saveMessage(description) {
    const from = localStorage.getItem('currentUserID');
    const to = localStorage.getItem('currentChatID');

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

    if (from === to) { 
      const collDocRef = collection(this.firestore, 'messages', from, 'mess');
      addDoc(collDocRef, this.message.toJSON()).then((result) => {
        const messageId = result.id;
        this.message.id = messageId;
        const docRefWithID = doc(this.firestore,'messages', messageId);
        setDoc(docRefWithID, this.message.toJSON());
        console.log('Anlage erfolgreich')
      }).catch((error) => {
        console.log(error);
      });
    } else {
      const collDocRef = collection(this.firestore, 'messages');
      addDoc(collDocRef, this.message.toJSON()).then((result) => {
        const messageId = result.id;
        this.message.id = messageId;
        const docRefWithID = doc(this.firestore,'messages', messageId);
        setDoc(docRefWithID, this.message.toJSON());
        console.log('Anlage erfolgreich')
      }).catch((error) => {
        console.log(error);
      });
    }


  }





  





  pushChatUser(newUser) {
    this.userService.getCurrentUser(newUser['id']).subscribe((user) => {
      this.activeChatUser.emit(user);
    });

  }



  getChatLength(toID) {
    this.getThisChat(toID).subscribe((value) => {
      let length = value.length;
      // console.log(value.length);
      this.chatLengthEmitter.emit(length);
    });
  }

  setLastDate(date: string) {
    this.lastDate = date;
  }

  getLastDate(): string {
    return this.lastDate;
  }
 

}

