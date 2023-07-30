import { Component, OnInit } from '@angular/core';
import { DrawerService } from '../services/drawer.service';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-thread-container',
  templateUrl: './thread-container.component.html',
  styleUrls: ['./thread-container.component.scss']
})
export class ThreadContainerComponent implements OnInit{

threads;
thread;
// observ;
countsOfThreads;
  constructor(private drawerService: DrawerService, private threadService: ThreadService ){

  }

 ngOnInit():void {
  this.threadService.threads.subscribe((threads)=>{
    this.threads = threads;
    this.countsOfThreads = this.threads.length;
    this.thread = this.threadService.thread;

 
  })
//  this.threads = this.threadService.threads;
//  console.log('threads:', this.threads);
  }


  closeThread(){
    this.drawerService.close();
  }


}
