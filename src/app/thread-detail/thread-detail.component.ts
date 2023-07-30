import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss']
})
export class ThreadDetailComponent implements OnInit {
author;
@Input() thread;


constructor(private userService: UserService){
  
}

ngOnInit(){
  console.log('EIN thread', this.thread);
  if(this.thread && this.thread.author){
    this.getAuthorDetails(this.thread);
  }
    
}

async getAuthorDetails(post){
  const userDataRef = await this.userService.getCurrentUser(post['author']).then((data)=>{
   
    data.subscribe((value)=>{
      this.author = value;
      console.log('Author:', this.author.username);
    
    })
  })
}

}
