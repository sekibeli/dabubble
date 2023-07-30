import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { Post } from '../models/post.class';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  activeChannel;
  posts;
  post;
  firestore: Firestore = inject(Firestore);

  constructor() { }


  async getAllPosts(channelID) {
    const collRef = collection(this.firestore, 'channels', channelID, 'posts');
    const postData = await collectionData(collRef,  {idField: 'id'});

    await postData.subscribe((post) => {
      this.posts = post;
      this.activeChannel = channelID;
      console.log('2. Post mit ID: ', post);
      console.log('1.activeChannel', this.activeChannel);
     
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

 getPost(channelID, docID){
  const docRef = collection(this.firestore, 'channels', channelID, 'posts' );
  const collData = doc(docRef, docID);


  onSnapshot(collData, (post) => {
    if (post.exists()) {
      this.post = post.data();
      console.log('DieserPost:', this.post);
    } else {
      console.log('User nicht vorhanden!');
    }
  });
 }
}

// ref => ref.orderBy('timestamp')