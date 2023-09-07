import { EventEmitter, Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, orderBy, query, updateDoc } from '@angular/fire/firestore';
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
// countsOfThreadsNew = new EventEmitter();
  constructor() { }


  async getThread(channelID, postID) {
localStorage.setItem('threadMessage', 'true');
    const collRef = await collection(this.firestore, 'channels', channelID, 'posts', postID, 'threads');
    const answer = query(collRef, orderBy('timestamp'))
    const userData = collectionData(answer, {idField: "id"});

    return new Promise((resolve, reject) => {
      userData.subscribe((threads) => {
        this._threads.next(threads);
        this.numberOfThreads = this._threads.getValue().length;
        resolve(threads);
      }, reject)
    });

  }



  getPostForThread(post, author) {
    this._postForThread.next(post);
    this._author.next(author);
  }


  // pushCountsOfThreads(counts){
  //   this.countsOfThreadsNew.emit(counts);
  // }

  getTimeFromLastAnswer(postID:string){
    let channelID = localStorage.getItem('currentChannelID');
    const colRef = collection(this.firestore, 'channels', channelID, 'posts', postID, 'threads');
    const answer = query(colRef, orderBy('timestamp'))
    const postData = collectionData(answer);
return postData;
  }


  async updatePost(channelID, postID, threadID, description){
    console.log('channel',channelID,'post', postID, 'Inhalt',description);
    const docRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'threads', threadID);
  
    await updateDoc(docRef, {
      description: description
    });
  
  
  
   }
}

