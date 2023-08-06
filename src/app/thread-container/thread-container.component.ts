import { Component, OnInit } from '@angular/core';
import { DrawerService } from '../services/drawer.service';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-thread-container',
  templateUrl: './thread-container.component.html',
  styleUrls: ['./thread-container.component.scss']
})
export class ThreadContainerComponent implements OnInit{
  timestamps:any = [];
singlePost: any;
threads;
thread;
countsOfThreads; //  Anzahl der Threads
trueFalseArray;
  constructor(private drawerService: DrawerService, private threadService: ThreadService ){

  }

 ngOnInit():void {
  this.threadService.threads.subscribe((threads)=>{
    this.threads = threads;
    this.countsOfThreads = this.threads.length;
    this.thread = this.threadService.thread;
    this.createTimestampArray(this.threads);
  // this.pushCountsOfThreads(this.countsOfThreads);

  })

  this.threadService.postForThread$.subscribe((post)=> {
    this.singlePost = post;})
 


  }

// pushCountsOfThreads(counts){
//   this.threadService.pushCountsOfThreads(counts);
// }


  closeThread(){
    this.drawerService.close();
    localStorage.setItem('threadMessage', 'false');
  }

  /**
 * 
 * @param posts Array with all posts
 * creates an array with the dates of all posts
 */
  createTimestampArray(threads){
    // let timestamps = [];
    threads.forEach((element) => {
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
