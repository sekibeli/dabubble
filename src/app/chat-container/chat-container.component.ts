import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { doc, onSnapshot } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.class';


@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  unsubscribeMessage: Subscription;
  id: string;
  chats: Post[];


  constructor(private messageService: MessageService, public activatedRoute: ActivatedRoute, public userService: UserService, private postService: PostService) {
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params['id'];
        this.getThisChat(this.id);
      });

  }

  trackByFn(item: Post) {
    return item.id; // Eindeutige ID aus dem item --> Kein flackern mehr!
  }


  getThisChat(toID) {
    this.unsubscribeMessage = this.messageService.getThisChat(toID).subscribe((chats) => {
      this.chats = <Post[]>chats;
      localStorage.setItem('currentChatLength', this.chats.length.toString());
    });
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.unsubscribeMessage.unsubscribe();
   }

}
