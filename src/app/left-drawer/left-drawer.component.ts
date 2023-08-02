import { Component, inject } from '@angular/core';
import { PostService } from '../services/post.service';
import { DrawerService } from '../services/drawer.service';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-left-drawer',
  templateUrl: './left-drawer.component.html',
  styleUrls: ['./left-drawer.component.scss']
})
export class LeftDrawerComponent {
  channels;
  firestore: Firestore = inject(Firestore);
  
  constructor(public postService: PostService, public drawerService: DrawerService, public channelService: ChannelService) {
      
    this.channelService.getChannels().then((items) => {
      items.subscribe((value) => {
        this.channels = value;
      });
    })

   
  }
 
 currentChannel(title){
  this.channelService.pushActiveChannel(title);
  
 }

//  getChannel(id){
// this.channelService.getchannel(id);
//  }

}
