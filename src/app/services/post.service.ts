import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
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


  // async getAllPosts(channelID) {
  //   const collRef = collection(this.firestore, 'channels', channelID, 'posts');
  //   const answer = query(collRef, orderBy('timestamp'))
  //   const postData = await collectionData(answer,   {idField: 'id'});

  //  postData.subscribe((post) => {
  //     this.posts = post;
  //     this.activeChannel = channelID;
       
  //       })
  //   return postData;
  // }



  getAllPosts(channelID) {
    const collRef = collection(this.firestore, 'channels', channelID, 'posts');
    const answer = query(collRef, orderBy('timestamp'))
    const postData = collectionData(answer,   {idField: 'id'});

   postData.subscribe((post) => {
      this.posts = post;
      this.activeChannel = channelID;
       
        })
    return postData;
  }

  /**
   * 
   * @param author 
   * @param channelID 
   * @param description 
   * @param postId 
   */
  savePost(author, channelID, description, postId?) {
    console.log('author:', author);
       this.post = new Post({
      id: '', 
      author: localStorage.getItem('currentUserID'),
      description: description,
     timestamp: new Date().getTime()})

   
    
     if(!postId){ 
      const collDocRef = collection(this.firestore, 'channels', channelID, 'posts');
     addDoc(collDocRef, this.post.toJSON()).then((result)=>{
     const postid = result.id;
     this.post.id = postid;
     const docRefWithID = doc(this.firestore,'channels', channelID, 'posts', postid);
     setDoc(docRefWithID, this.post.toJSON());
      console.log('Anlage erfolgreich', this.post)
    }).catch((error)=>{
      console.log(error);
    });} else {
      channelID = this.activeChannel;
      const collDocRef = collection(this.firestore, 'channels', channelID, 'posts', postId, 'threads');
     addDoc(collDocRef, this.post.toJSON()).then((result)=>{
      const postid = result.id;
      this.post.id = postid;
      const docRefWithID = doc(this.firestore,'channels', channelID, 'posts', postId, 'threads', postid);
      setDoc(docRefWithID, this.post.toJSON())
      console.log('Anlage erfolgreich', this.post)
    }).catch((error)=>{
      console.log(error);
    });
    }
       }

      





 getPost(channelID, docID){
  const docRef = collection(this.firestore, 'channels', channelID, 'posts' );
  const collData = doc(docRef, docID);


  // onSnapshot(collData, (post) => {
  //   if (post.exists()) {
  //     this.post = post.data();
  //     console.log('DieserPost:', this.post);
  //   } else {
  //     console.log('User nicht vorhanden!');
  //   }
  // });
 }

 async updatePost(channelID, postID, description){
  const docRef = doc(this.firestore, 'channels', channelID, 'posts', postID);

  await updateDoc(docRef, {
    description: description
  })
 }
}

