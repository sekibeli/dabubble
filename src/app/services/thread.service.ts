import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private _postForThread: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private _author: BehaviorSubject<any> = new BehaviorSubject<any>([])
  // private author;
  public thread;
  public numberOfThreads;
firestore: Firestore = inject(Firestore);
public _threads = new BehaviorSubject<any[]>([]);
public readonly threads = this._threads.asObservable();
public readonly postForThread$ = this._postForThread.asObservable();
public readonly author$ = this._author.asObservable();

  constructor() { }


  async getThread(channelID, postID){
    console.log(channelID);
    const collRef = await collection(this.firestore, 'channels', channelID, 'posts', postID, 'threads');
    const answer = query(collRef, orderBy('timestamp'))
    const userData = collectionData(answer);

    return new Promise((resolve, reject) => {
    userData.subscribe((threads)=>{
      this._threads.next(threads);
      this.numberOfThreads = this._threads.getValue().length;
      resolve(threads);
    }, reject)
    });
   
      }
     


      getPostForThread(post, author){
        // console.log('neuer Versuch:', post, author);
this._postForThread.next(post);
this._author.next(author);
      }
}

