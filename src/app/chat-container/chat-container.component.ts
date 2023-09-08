import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.class';


@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {

  subscription;
  id: string;
  chats: Post[];


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

  trackByFn(item: Post) {
    return item.id; // Eindeutige ID aus dem item --> Kein flackern mehr!
  }


  getThisChat(toID) {
    this.messageService.getThisChat(toID).subscribe((chats) => {
      this.chats = <Post[]>chats;
      console.log('this.chats', this.chats);
      localStorage.setItem('currentChatLength', this.chats.length.toString());
    });
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('zerstört');
  }

}
