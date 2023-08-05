import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../models/post.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PostContainerComponent } from '../post-container/post-container.component';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() singlePost;
  @Input() user; // aus message der User an den die Message ist
  currentUser;
  currentChannel;
  post: Post;
  directMessage; // sets if input is directMessage or not
  channelMessage;
  currentChatID;
  chatMessage: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  constructor(public postService: PostService, public activatedRoute: ActivatedRoute, public messageService: MessageService) {
// this.directMessage = localStorage.getItem('directMessage');
// console.log(this.directMessage);
// this.currentChatID = localStorage.getItem('currentChatID');
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUserID');
    this.directMessage = JSON.parse(localStorage.getItem('directMessage'));
    this.channelMessage = JSON.parse(localStorage.getItem('channelMessage'));
    // console.log('nachricht an ', this.user);
    }

  savePost(description, postId) {
    console.log('postDescription:', description);
    this.currentChannel = this.activatedRoute.snapshot.params['id'];
    let channelID = this.currentChannel;
    description = this.chatMessage.value.description;
    this.postService.savePost(this.currentUser, channelID, description, postId);
    this.chatMessage.reset();
    
  }

  saveMessage(description){
    description = this.chatMessage.value.description;
    console.log('Message description:', description);
    this.messageService.saveMessage(description);
    this.chatMessage.reset();
  }
}
