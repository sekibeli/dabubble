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
  constructor(public userService: UserService){
  //   this.chatTo = localStorage.getItem('currentChatID');
  //  this.user = JSON.parse(localStorage.getItem('currentChatUser'));
  //  console.log('USER:', this.user);
  }



  // getUserDetails(){
  //   this.userService.getCurrentUser(this.chatTo).subscribe((user)=>{
  //   console.log('UUUSer:', user);
  //       this.user = user;
  //     })
  //   }
  }

