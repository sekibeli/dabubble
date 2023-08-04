import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ActivatedRoute } from '@angular/router';

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
  mergedData;

  constructor(private messageService: MessageService, public activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params['id'];
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
      });
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
