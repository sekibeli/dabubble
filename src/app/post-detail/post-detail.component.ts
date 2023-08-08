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
  countsOfThreads;
  flip: boolean;
  constructor(private userService: UserService, private drawerService: DrawerService, private threadService: ThreadService, private postService: PostService) {

  }

  ngOnInit() {
    if (this.post){
     
if(this.post['author'] === localStorage.getItem('currentUserID')) {
  this.flip = true;
} else {
  this.flip = false;
}
    }
    this.getAuthorDetails(this.post);
    this.getTimeFromTimestamp(this.post['timestamp']);
       this.getThread(this.postService.activeChannel, this.post.id);
   this.getFormatedDateFromTimestamp(this.post['timestamp']);

  //  this.threadService.countsOfThreadsNew.subscribe((value)=>{
  //   this.countsOfThreads = value;
  //  })

  }

  /**
   * Abruf von author-Daten anhand des Posts
   */
  getAuthorDetails(post) {
    const userDataRef = this.userService.getCurrentUser(post['author']).subscribe((value) => {
     
        this.author = value;

      });
    }
  

  getTimeFromTimestamp(timestamp) {
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
     
  }

  

}
