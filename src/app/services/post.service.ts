import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Post } from '../models/post.class';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts;
  post;
  firestore: Firestore = inject(Firestore);

  constructor() { }


  async getAllPosts(channelID) {
    const collRef = collection(this.firestore, 'channels', channelID, 'posts');
    const postData = await collectionData(collRef);

    await collectionData(collRef).subscribe((post) => {
      this.posts = post;
      // console.log('Postings:',this.posts);
    })
    return postData;
  }

  savePost(author, channelID, description) {
    console.log('author:', author);
       this.post = new Post({
      id: '', 
      author: localStorage.getItem('currentUserID'),
      description: description,
     timestamp: new Date().getTime()})
 
     console.log('channelID:', channelID);
    const collDocRef = collection(this.firestore, 'channels', channelID, 'posts');

    addDoc(collDocRef, this.post.toJSON()).then((result)=>{
      console.log('Anlage erfolgreich')
    }).catch((error)=>{
      console.log(error);
    });
  
    

  }

  countThreads(){}
}

// ref => ref.orderBy('timestamp')