import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import { DrawerService } from '../services/drawer.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
@Input() post;
author;
time;

constructor(private userService: UserService, private drawerService: DrawerService){

}

ngOnInit(){

   this.getAuthorDetails(this.post);
  this.getTimeFromTimestamp(this.post['timestamp']);
}

async getAuthorDetails(post){
  const userDataRef = await this.userService.getCurrentUser(post['author']).then((data)=>{
   
    data.subscribe((value)=>{
      this.author = value;
    
    })
  })
}

getTimeFromTimestamp(timestamp){
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

getThreads(channelID, postID){
this.drawerService.open();
}

}
