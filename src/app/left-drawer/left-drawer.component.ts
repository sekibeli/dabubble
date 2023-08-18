import { Component, EventEmitter, HostListener, Input, OnInit, Output, inject } from '@angular/core';
import { PostService } from '../services/post.service';
import { DrawerService } from '../services/drawer.service';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import { MessageService } from '../services/message.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from '../dialog-new-channel/dialog-new-channel.component';

@Component({
  selector: 'app-left-drawer',
  templateUrl: './left-drawer.component.html',
  styleUrls: ['./left-drawer.component.scss']
})
export class LeftDrawerComponent implements OnInit{
 isSmallScreen;
  @Output() callToggle = new EventEmitter();
  users;
  channels;
  currentUserID;
  firestore: Firestore = inject(Firestore);
  user;
  chArrowIcon = 'arrow_drop_down';
  userArrowIcon = 'arrow_drop_down';
  chOpen = true;
  userOpen = true;
  
  
  constructor(public postService: PostService, public drawerService: DrawerService, public channelService: ChannelService, public userService: UserService, public messageService: MessageService, public dialog: MatDialog) {
    this.checkScreenSize();
    this.channelService.getChannels().subscribe((value) => {
      
        this.channels = value;
      });
   

  }

  ngOnInit(): void {
    this.userService.getUserData().subscribe((users)=> {
            this.users = users;
         })
   
    this.currentUserID = localStorage.getItem('currentUserID');
    // console.log(this.currentUserID);
  }
 
 triggerToggle(){this.callToggle.emit();
}
 

 pushChatUser(user){
  this.messageService.pushChatUser(user);
 
 }
 
 openDialogAddChannel(){
this.dialog.open(DialogNewChannelComponent)
 }

toggleChannelOpenClose() {
  this.chOpen = !this.chOpen;
  this.chArrowIcon = this.chArrowIcon === 'arrow_drop_down' ? 'arrow_right' : 'arrow_drop_down'
}

toggleUserOpenClose() {
  this.userOpen = !this.userOpen;
  this.userArrowIcon = this.userArrowIcon === 'arrow_drop_down' ? 'arrow_right' : 'arrow_drop_down'
}
@HostListener('window:resize', ['$event'])
onResize(event) {
  this.checkScreenSize();
}

checkScreenSize() {
  if(window.innerWidth < 600) {
    this.isSmallScreen = true;
  } else {
    this.isSmallScreen = false;
  }
}

}
