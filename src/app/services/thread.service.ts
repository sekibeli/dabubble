import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
firestore: Firestore = inject(Firestore);
private _threads = new BehaviorSubject<any[]>([]);
readonly threads = this._threads.asObservable();

  constructor() { }


  async getThread(channelID, postID){
    console.log(channelID);
    const collRef = await collection(this.firestore, 'channels', channelID, 'posts', postID, 'threads');
    const userData = collectionData(collRef);

    userData.subscribe((threads)=>{
      this._threads.next(threads);
      console.log('service:', this._threads.getValue());
      
    })
//  this.threadData = userData;
//  console.log(this.threadData);
   
      }
}

