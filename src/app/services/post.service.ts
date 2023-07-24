import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts;
firestore: Firestore = inject(Firestore);
  constructor() { }


  async getAllPosts(channel){
    const collRef = collection(this.firestore, 'channels', channel, 'posts');
    const postData = await collectionData(collRef);

    await collectionData(collRef).subscribe((post)=> {
      this.posts = post;
      console.log('Postings:',this.posts);
    })
    // return postData;
  }
}
