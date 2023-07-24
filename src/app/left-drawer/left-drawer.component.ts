import { Component } from '@angular/core';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-left-drawer',
  templateUrl: './left-drawer.component.html',
  styleUrls: ['./left-drawer.component.scss']
})
export class LeftDrawerComponent {
constructor(public postService: PostService){}
posts;

// getAllPosts(id){
//   this.postService.getAllPosts(id).then((value)=>{
//  value.subscribe((post => {
//   console.log(post);
//   this.posts = post;
//  }))
//   })
// }
zeigmal(id){
  this.postService.getAllPosts(id);

}
}
