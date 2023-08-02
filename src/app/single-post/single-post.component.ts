import { Component, Input, OnInit } from '@angular/core';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
time;
singlePost: any;
author: any;
@Input() countsOfThreads;

  constructor(public threadService: ThreadService){}

  ngOnInit() {
this.threadService.postForThread$.subscribe((post)=> {
  this.singlePost = post;
  this.threadService.author$.subscribe((author)=> {
    this.author = author;

this.time = new Date(this.singlePost['timestamp']).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
  })
})
  
  }


}
  

