import { Component, OnInit, inject } from '@angular/core';
import { PostService } from '../services/post.service';
import { DrawerService } from '../services/drawer.service';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';

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
  
  constructor(public postService: PostService, public drawerService: DrawerService, public channelService: ChannelService, public userService: UserService) {
      
    this.channelService.getChannels().then((items) => {
      items.subscribe((value) => {
        this.channels = value;
      });
    })

  }

  ngOnInit(): void {
    this.userService.getUserData().then((data)=> {
      data.subscribe((users)=> {
         this.users = users;
         console.log(users);
        
      })
    })
    this.currentUserID = localStorage.getItem('currentUserID');
    console.log(this.currentUserID);
  }
 
 
 currentChannel(title){
  this.channelService.pushActiveChannel(title);
  
 }

//  getChannel(id){
// this.channelService.getchannel(id);
//  }

}
