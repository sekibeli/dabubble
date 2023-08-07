import { Component} from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent  {
// chatTo;
// user;
chatLength;
  constructor(public userService: UserService){
this.chatLength = localStorage.getItem('currentChatLength');
  }



  }

