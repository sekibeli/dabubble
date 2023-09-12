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


  formatDay(timestamp) {
    const date = new Date(timestamp);
    let day = date.getDate();
    let month = date.getMonth() + 1;

    // Führende Nullen hinzufügen, falls nötig
    let strDays = (day < 10 ? '0' : '') + day.toString();
    let strMonths = (month < 10 ? '0' : '') + month.toString();
    return strDays + '.' + strMonths;
  }

  getFormatedDateFromTimestamp(timestamp) {

    let date = new Date(timestamp);
    return new Date(timestamp).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });

  }
  getAllPosts(channelID) {
    const collRef = collection(this.firestore, 'channels', channelID, 'posts');
    const answer = query(collRef, orderBy('timestamp'))
    const postData = collectionData(answer, { idField: 'id' });

    postData.subscribe((post) => {
      this.posts = post;
      this.activeChannel = channelID;
    })
    return postData;
  }


  savePost(author, channelID, description, postId?, file?) {
    if (file == null) file = '';

    this.post = new Post({
      id: '',
      author: localStorage.getItem('currentUserID'),
      description: description,
      timestamp: new Date().getTime(),
      file: file
    })


    if (!postId) {
      const collDocRef = collection(this.firestore, 'channels', channelID, 'posts');
      addDoc(collDocRef, this.post.toJSON()).then((result) => {
        const postid = result.id;
        this.post.id = postid;
        const docRefWithID = doc(this.firestore, 'channels', channelID, 'posts', postid);
        setDoc(docRefWithID, this.post.toJSON());
        console.log('Anlage erfolgreich', this.post)
      }).catch((error) => {
        // console.log(error);
      });
    } else {
      channelID = this.activeChannel;
      const collDocRef = collection(this.firestore, 'channels', channelID, 'posts', postId, 'threads');
      addDoc(collDocRef, this.post.toJSON()).then((result) => {
        const postid = result.id;
        this.post.id = postid;
        const docRefWithID = doc(this.firestore, 'channels', channelID, 'posts', postId, 'threads', postid);
        setDoc(docRefWithID, this.post.toJSON())
        // console.log('Anlage erfolgreich', this.post)
      }).catch((error) => {
        // console.log(error);
      });
    }
  }


  getPost(channelID, docID) {
    const docRef = collection(this.firestore, 'channels', channelID, 'posts');
    const collData = doc(docRef, docID);
  }


  async updatePost(channelID, postID, description) {
    console.log('channel', channelID, 'post', postID, 'Inhalt', description);
    const docRef = doc(this.firestore, 'channels', channelID, 'posts', postID);

    await updateDoc(docRef, {
      description: description
    });
  }

}

