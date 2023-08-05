import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

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
  

  constructor(private messageService: MessageService, public activatedRoute: ActivatedRoute, public userService: UserService) {

  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params['id'];
        console.log('params:',params['id']);
        console.log('localStorage:', localStorage.getItem('currentUserID'));
        this.getThisChat(this.id);
      });
  }

  getThisChat(toID) {
    this.messageService.getThisChat(toID).then((value) => {
      const docRef1 = value.docRef1.subscribe((data1) => {
        this.data1 = data1;
      });
      const docRef2 = value.docRef2.subscribe((data2) => {
        this.chats = this.data1.concat(data2);
        this.chats.sort((a,b) =>{  // sortiert den Datensatz this.chats nach timestamp
          return a.timestamp - b.timestamp;
        })
      });
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
