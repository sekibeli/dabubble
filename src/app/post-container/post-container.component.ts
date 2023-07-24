import { Component } from '@angular/core';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss']
})
export class PostContainerComponent {
posts;

  constructor(public postService: PostService){
    this.posts = this.postService.posts;
    console.log('Posts: ');
  }

  

}
