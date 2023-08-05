import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
chatTo;
user;
  constructor(public userService: UserService){
    this.chatTo = localStorage.getItem('currentChatID');
  }


  getUserDetails(){
    this.userService.getCurrentUser(this.chatTo).then((value)=>{
      value.subscribe((user)=> {
        this.user = user;
      })
    })
  }
}
