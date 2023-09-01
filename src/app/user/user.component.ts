import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user;
  currentUserID;
  isActive: boolean = false;

  constructor(public messageService: MessageService, public drawerService: DrawerService){}

ngOnInit(): void {
  this.currentUserID = localStorage.getItem('currentUserID');
  // console.log(this.currentUserID);
}
  pushChatUser(user){
    this.messageService.pushChatUser(user);
   
   }
   
   
  setMode(mode:boolean){
    localStorage.setItem('directMessage', JSON.stringify(mode));
    localStorage.setItem('channelMessage', JSON.stringify(!mode));
  }

  onProfileClick($event){
    this.isActive = !this.isActive;
    this.messageService.getThisChat(this.user['id']);
    this.setMode(true); 
    this.drawerService.close(); 
    this.messageService.setChatUser(this.user); 
    this.pushChatUser(this.user); 
    this.messageService.getChatLength(this.user['id'])

    if (window.innerWidth < 600) {
      this.drawerService.toggle();
      event.preventDefault();
    
      this.drawerService.setMyVariable(true)
 
    }
  }
}
