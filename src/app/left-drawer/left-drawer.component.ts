import { Component, OnInit, inject } from '@angular/core';
import { PostService } from '../services/post.service';
import { DrawerService } from '../services/drawer.service';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import { MessageService } from '../services/message.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-left-drawer',
  templateUrl: './left-drawer.component.html',
  styleUrls: ['./left-drawer.component.scss']
})
export class LeftDrawerComponent implements OnInit{
  users;
  channels;
  currentUserID;
  firestore: Firestore = inject(Firestore);
  user;
  
  constructor(public postService: PostService, public drawerService: DrawerService, public channelService: ChannelService, public userService: UserService, public messageService: MessageService) {
      
    this.channelService.getChannels().subscribe((value) => {
      
        this.channels = value;
      });
   

  }

  ngOnInit(): void {
    this.userService.getUserData().subscribe((users)=> {
            this.users = users;
         })
   
    this.currentUserID = localStorage.getItem('currentUserID');
    console.log(this.currentUserID);
  }
 
 
 currentChannel(title, id){
  this.channelService.pushActiveChannel(title, id);
  
 }

 pushChatUser(user){
  this.messageService.pushChatUser(user);
 
 }
 
 
setMode(mode:boolean){
  localStorage.setItem('directMessage', JSON.stringify(mode));
  localStorage.setItem('channelMessage', JSON.stringify(!mode));
}
}
