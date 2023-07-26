import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss']
})
export class PostContainerComponent implements OnInit{
posts;
id;

  constructor(public postService: PostService, public route: Router, public activatedRoute: ActivatedRoute){
   
    
  }

  ngOnInit(){
this.activatedRoute.params.subscribe(
  (params)=> {
    this.id = params['id'];
  this.getPosts(this.id);
  });

  }

  async getPosts(id){
   this.postService.getAllPosts(id).then((postings)=>{
postings.subscribe((posts)=>{
  this.posts = posts;
  console.log('Posts:', posts);
})
   });
   
  }

}
