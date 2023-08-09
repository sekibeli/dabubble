import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-postheader',
  templateUrl: './postheader.component.html',
  styleUrls: ['./postheader.component.scss']
})
export class PostheaderComponent implements OnInit {

  activeChannelTitle = 'Angular';
  activeChannelID: BehaviorSubject<string> =   new BehaviorSubject<string>('9Gwz1Ce763caWx5FCBZL');
  members;
  countsOfMembers;
  currentChannelUser;
  constructor(public channelService: ChannelService, public userService: UserService) {
    this.channelService.activeChannelID.subscribe((value)=> {
      this.activeChannelID.next(value);
     
    });
 }
    
  

  ngOnInit() {
      // this.channelService.currentChannelUser.subscribe((user)=>{
      //  this.currentChannelUser
      // });

    this.channelService.activeChannelTitle.subscribe(
      (value) => {
        this.activeChannelTitle = value;
      } );
 
      this.channelService.channelUserArrayEmitter.subscribe((users)=> {
        console.log(users);
        this.members = users;
        this.countsOfMembers = this.members.length;
      });
     

    // this.channelService.activeChannelID.subscribe((newActiveChannelID) => { 
    //          this.channelService.getMembersTest(newActiveChannelID).subscribe((value)=>{
    //     this.members = value;
       
    //    });
   
    // });
  
  }

}
