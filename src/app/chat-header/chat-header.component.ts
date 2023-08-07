import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.class';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit{
  // @Input() user;
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUserID; // ID vom eingeloggten User
  


  constructor(public messageService:MessageService, public userService:UserService){
      this.currentUserID = localStorage.getItem('currentUserID');
    const currentUser = JSON.parse(localStorage.getItem('currentChatUser'));
   this.user.next(currentUser); // Damit beim ersten Aufruf ein Wert da ist.
      }


  ngOnInit(): void {
    this.messageService.activeChatUser.subscribe((value)=>{
           this.user.next(value) ;
        });
        if (this.user['id']){
        this.userService.getCurrentUser(this.user['id']).subscribe((value)=>{  // holt sich immer die aktuellen Daten aus dem Firestore
          this.user.next(value as User);
        })
      }
  }

}




