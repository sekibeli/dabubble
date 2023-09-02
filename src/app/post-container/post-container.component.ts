import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChannelService } from '../services/channel.service';


@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss']
})
export class PostContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer: ElementRef;
  timestamps = [];
  posts;
  id;
  subscription: Subscription;
  trueFalseArray = [];
channelPromise;
channel;
  constructor(public postService: PostService, public route: Router, public activatedRoute: ActivatedRoute, private channelService: ChannelService) {
  
  }
  /**
   * Funktion zur Beobachtung der URL, so dass die Inhalte gemäß der URL immer neu geladen werden.
   */
  async ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      async (params) => {
        this.id = params['id'];
        this.getPosts(this.id);
       const channelData = await this.channelService.getChannelData(this.id);
      //  console.log(channelData);
       this.channel = channelData;
      });
    
      
    
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  /**
   * subscription muss manuell beseitigt werden, da sie nicht automatisch erlöscht. Ansonsten läuft der Speicher voll.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  /**
   * 
   * @param id document ID 
   * Die Postings eines Channels werden abgerufen
   */
getPosts(id) {
    this.postService.getAllPosts(id).subscribe((posts) => {
   
        this.posts = posts;
        // console.log(this.posts);
     this.createTimestampArray(this.posts);
      });
    
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
