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

constructor(private userService: UserService){}

ngOnInit(): void {
  this.getDetailsFromID(this.chat['fromID']);
}
getDetailsFromID(fromID){
  this.userService.getCurrentUser(fromID).then((value)=>{
    value.subscribe((user)=>{
      this.messageAuthor = user;
      console.log(this.messageAuthor);
    });
  });
}


}


