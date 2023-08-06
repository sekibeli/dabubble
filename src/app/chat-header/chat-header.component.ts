import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.class';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent {
  // @Input() user;
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUserID;


  constructor(public messageService:MessageService){
    this.user = new BehaviorSubject<User>(null);
 
    this.currentUserID = localStorage.getItem('currentUserID');
    const currentUser = JSON.parse(localStorage.getItem('currentChatUser'));

    // this.messageService.updateUser(currentUser);

    this.messageService.activeChatUser.subscribe((value)=>{
      console.log('Im Header value:', value);
      
      this.user.next(value) ;
      console.log('Im Header:', this.user);
    
    })

     
  }

  // updateUser(newUser: User){
  //   this.user.next(newUser);
  // }
}




