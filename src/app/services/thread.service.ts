import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  public numberOfThreads;
firestore: Firestore = inject(Firestore);
public _threads = new BehaviorSubject<any[]>([]);
public readonly threads = this._threads.asObservable();

  constructor() { }


  async getThread(channelID, postID){
    console.log(channelID);
    const collRef = await collection(this.firestore, 'channels', channelID, 'posts', postID, 'threads');
    const userData = collectionData(collRef);

    return new Promise((resolve, reject) => {
    userData.subscribe((threads)=>{
      this._threads.next(threads);
      this.numberOfThreads = this._threads.getValue().length;
   
      resolve(threads);
     
      // return threads;
    }, reject)
    });
   
      }
     
}

