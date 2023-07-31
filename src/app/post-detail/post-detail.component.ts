import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import { DrawerService } from '../services/drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ThreadService } from '../services/thread.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  @Input() post;
  // @Input() timestamps;
  @Input() trueFalse:boolean;
  author;
  time;
  currentChannel;
  numberOfThreads = 0;
  formatedDate;
  lastWeekday = '';
  einTag;
  newDay = true;
  constructor(private userService: UserService, private drawerService: DrawerService, private threadService: ThreadService, private postService: PostService) {

  }

  ngOnInit() {

    this.getAuthorDetails(this.post);
    this.getTimeFromTimestamp(this.post['timestamp']);
    console.log('channel:', this.postService.activeChannel, 'postID:', this.post.id);
    this.getThread(this.postService.activeChannel, this.post.id);
   this.getFormatedDateFromTimestamp(this.post['timestamp']);

    //  this.userService.getAuthorDetails(this.post).then((value:any)=>{
    //  value.subscribe((item)=>{
    //   console.log(item);
    //  })
    //  })

console.log('Diesmal:', this.trueFalse);

  }

  /**
   * Abruf von author-Daten anhand des Posts
   */
  async getAuthorDetails(post) {
    const userDataRef = await this.userService.getCurrentUser(post['author']).then((data) => {

      data.subscribe((value) => {
        this.author = value;

      })
    })
  }

  getTimeFromTimestamp(timestamp) {
    console.log(timestamp);
    //   let date = new Date(milliseconds);
    //   let heute = new Date();
    //  let heutezahl = heute.getTime();
    //   this.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});

    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    this.time = hours + ':' + minutes;

  }

  getThread(channelID, postID) {
    this.threadService.getThread(channelID, postID).then((threads: any) => {
      this.numberOfThreads = threads.length;
    });

  }

  getFormatedDateFromTimestamp(timestamp) {

    let date = new Date(timestamp);
     this.formatedDate = new Date(timestamp).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });
          console.log('Formatiertes Datum: ', this.formatedDate);
 
  }

  

}
