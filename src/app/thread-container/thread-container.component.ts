import { Component, OnDestroy, OnInit } from '@angular/core';
import { DrawerService } from '../services/drawer.service';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-thread-container',
  templateUrl: './thread-container.component.html',
  styleUrls: ['./thread-container.component.scss']
})
export class ThreadContainerComponent implements OnInit, OnDestroy{
  timestamps:any = [];
singlePost: any;
threads;
thread;
countsOfThreads; //  Anzahl der Threads

  constructor(private drawerService: DrawerService, private threadService: ThreadService ){
    this.threadService.postForThread$.subscribe((post)=> {
      this.singlePost = post;})
  }

 ngOnInit():void {
  this.threadService.threads.subscribe((threads)=>{
    this.threads = threads;
    this.countsOfThreads = this.threads.length;
    this.thread = this.threadService.thread;

   })


   }
ngOnDestroy(): void {
  // console.log('container zerstört');
}

  closeThread(){
    this.drawerService.close();
    localStorage.setItem('threadMessage', 'false');
  }

  trackByFn(item) {
    return item.id;  // oder irgendeine andere eindeutige Eigenschaft des Items
  }
  /**
 * 
 * @param posts Array with all posts
 * creates an array with the dates of all posts
 */
  createTimestampArray(threads){
        threads.forEach((element) => {
       this.timestamps.push(new Date(element['timestamp']).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }));
     });
        }

  }
