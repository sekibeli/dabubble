import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit {
@Input() chat;
messageAuthor;
messageRecipient;
flip: boolean;

constructor(private userService: UserService){


}

ngOnInit(): void {
  this.getDetailsFromID(this.chat['fromID']);

  if(this.chat){
    const fromID = this.chat['fromID'];
    const userID = localStorage.getItem('currentUserID');
    this.flip = fromID === userID;
    console.log(this.flip);
  }
  
  
}
getDetailsFromID(fromID){
  this.userService.getCurrentUser(fromID).subscribe((user)=>{
  
      this.messageAuthor = user;
      console.log(this.messageAuthor);
    });
  }
}





