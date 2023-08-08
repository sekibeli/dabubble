import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../services/user.service';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-postheader',
  templateUrl: './postheader.component.html',
  styleUrls: ['./postheader.component.scss']
})
export class PostheaderComponent implements OnInit {

  activeChannelTitle = 'Angular';
  activeChannelID: BehaviorSubject<string> =   new BehaviorSubject<string>('9Gwz1Ce763caWx5FCBZL');
  members: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(public channelService: ChannelService, public userService: UserService) {
   
  }

  ngOnInit() {
    this.channelService.activeChannelTitle.subscribe(
      (value) => {
        this.activeChannelTitle = value;
      } );
      this.channelService.getMembers(this.activeChannelID.getValue()).subscribe((initialMembers) => {
        this.members.next(initialMembers);
    });
  

    this.channelService.activeChannelID.subscribe((newActiveChannelID) => { 

      //  this.channelService.getMembersTest(newActiveChannelID)
      
      this.channelService.getMembersTest(newActiveChannelID).subscribe((value)=>{
        console.log(value);
        this.members.next(value);
        console.log(this.members.getValue());
       });
      // this.channelService.getMembers(newActiveChannelID).subscribe((value)=> {
      //   this.members.next(value);
      //   console.log(this.members.getValue());
      // });
    });
  
  }

  


  
   

}
