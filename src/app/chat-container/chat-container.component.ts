import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';


@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  // currentUserID;
  subscription;
  id;
  chats;
  data1;
 
 

  constructor(private messageService: MessageService, public activatedRoute: ActivatedRoute, public userService: UserService, private postService: PostService) {

  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params['id'];
        // console.log('params:',params['id']);
        // console.log('localStorage:', localStorage.getItem('currentUserID'));
        this.getThisChat(this.id);
      });
    
  }


getThisChat(toID) {
  this.messageService.getThisChat(toID).subscribe((chats) => {
                this.chats = chats;
                localStorage.setItem('currentChatLength', this.chats.length);
             
                // console.log('ersteMessage', this.firstMessageDate);
                // this.firstMessage = this.chats[0]['description'];
                // console.log('aktueller Chat:', this.chats);
          });
    }

ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
