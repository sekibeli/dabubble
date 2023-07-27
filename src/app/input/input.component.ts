import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  currentUser;
  currentChannel;
  post: Post;
  chatMessage: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
    // password: new FormControl('', Validators.required)
  })

  constructor(public postService: PostService, public activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUserID');
    // this.currentChannel = this.activatedRoute.snapshot.params['id']

   

  }

  savePost(description){
  
    this.currentChannel = this.activatedRoute.snapshot.params['id'];
let channelID = this.currentChannel;
 
description = this.chatMessage.value.description;

    this.postService.savePost(this.currentUser, channelID, description);
    this.chatMessage.reset();
  }

}
