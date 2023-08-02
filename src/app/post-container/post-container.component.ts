import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss']
})
export class PostContainerComponent implements OnInit, OnDestroy {
  timestamps = [];
  posts;
  id;
  subscription: Subscription;
  trueFalseArray = [];

  constructor(public postService: PostService, public route: Router, public activatedRoute: ActivatedRoute) {
 
  }
  /**
   * Funktion zur Beobachtung der URL, so dass die Inhalte gemäß der URL immer neu geladen werden.
   */
  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params['id'];
        this.getPosts(this.id);
      });
     
  }

  /**
   * subscription muss manuell beseitigt werden, da sie nicht automatisch erlöscht. Ansonsten läuft der Speicher voll.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * 
   * @param id document ID 
   * Die Postings eines Channels werden abgerufen
   */
  async getPosts(id) {
    this.postService.getAllPosts(id).then((postings) => {
      postings.subscribe((posts) => {
        this.posts = posts;
     this.createTimestampArray(posts);
      })
    
    });

  }

  /**
   * 
   * @param channelID ID from the channel
   * @param docID ID from the post
   * 
   * gets a certain post from firestore
   */
  async getPost(channelID, docID) {
    this.postService.getPost(channelID, docID);
  }

/**
 * 
 * @param posts Array with all posts
 * creates an array with the dates of all posts
 */
  createTimestampArray(posts){
   
    posts.forEach((element) => {
       this.timestamps.push(new Date(element['timestamp']).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }));
     });
       this.trueFalseArray = this.dateCompare(this.timestamps)
     }

     /**
      * 
      * @param strings the array with the dates of all posts as string
      * @returns a new array with only booleans for use if a date of a post is shown or not
      */
 dateCompare(strings) {
    let newArray = [true]; // Der erste Wert ist immer true
    for(let i = 1; i < strings.length; i++) {
        if(strings[i] !== strings[i - 1]) {
            newArray.push(true);
        } else {
            newArray.push(false);
        }
    }
    return newArray;
}
  
}
