import { Component } from '@angular/core';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss']
})
export class PostContainerComponent {
posts;
id;

  constructor(public postService: PostService){
    this.getPosts();
   
   
  }

  async getPosts(){
   this.postService.getAllPosts('9Gwz1Ce763caWx5FCBZL').then((postings)=>{
postings.subscribe((posts)=>{
  this.posts = posts;
  console.log('Posts:', posts);
})
   });
   
  }

}
