import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.class';
import { Post } from '../models/post.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-input-post',
  templateUrl: './input-post.component.html',
  styleUrls: ['./input-post.component.scss']
})
export class InputPostComponent implements OnInit {
  @Input() singlePost;
  chatLength: BehaviorSubject<number>;
  // @Input() user; // aus message der User an den die Message ist
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUser;
  currentChannel; // die ID
  channelTitle: BehaviorSubject<String> = new BehaviorSubject<String>('Angular');
  post: Post;
  directMessage; // sets if input is directMessage or not
  channelMessage;
  currentChatID;
  currentChatUser;
  currentChatLength;
  chatMessage: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  constructor(public postService: PostService, public activatedRoute: ActivatedRoute, private channelService: ChannelService) {
    const currentChatPartner = JSON.parse(localStorage.getItem('currentChatUser'))
    this.user.next(currentChatPartner);
    this.currentChatLength = (Number(localStorage.getItem('currentChatLength')));
     

  }

  ngOnInit() {
  //   this.messageService.activeChatUser.subscribe((value)=>{
  //     this.user.next(value) ;
  //  })

//    this.messageService.chatLengthEmitter.subscribe((value)=>{
//  this.currentChatLength = value;
//    });

   this.channelService.activeChannelTitle.subscribe((value)=>{
    this.channelTitle.next(value);
   });
    this.currentUser = localStorage.getItem('currentUserID');
    this.directMessage = JSON.parse(localStorage.getItem('directMessage'));
    this.channelMessage = JSON.parse(localStorage.getItem('channelMessage'));

    }

  savePost(description, postId) {
    console.log('postDescription:', description);
    this.currentChannel = this.activatedRoute.snapshot.params['id'];
    let channelID = this.currentChannel;
    description = this.chatMessage.value.description;
    this.postService.savePost(this.currentUser, channelID, description, postId);
    this.chatMessage.reset();
    
  }

  // saveMessage(description){
  //   description = this.chatMessage.value.description;
  //   console.log('Message description:', description);
  //   this.messageService.saveMessage(description);
  //   this.chatMessage.reset();
  // }
}
