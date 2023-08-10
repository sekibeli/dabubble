import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';

@Component({
  selector: 'app-postheader',
  templateUrl: './postheader.component.html',
  styleUrls: ['./postheader.component.scss']
})
export class PostheaderComponent implements OnInit {

  activeChannelTitle = 'Angular';
  activeChannelID: BehaviorSubject<string> = new BehaviorSubject<string>('9Gwz1Ce763caWx5FCBZL');
  members;
  countsOfMembers;
  currentChannelUser;

  constructor(public channelService: ChannelService, public userService: UserService, public dialog: MatDialog) {
    this.members = this.channelService.currentChannelUserArray;
this.countsOfMembers = this.members.length;
    this.channelService.activeChannelID.subscribe((value) => {
      this.activeChannelID.next(value);
    });
  }

  ngOnInit() {
    // this.channelService.pushActiveChannel('Angular', '9Gwz1Ce763caWx5FCBZL' );

    this.channelService.activeChannelTitle.subscribe(
      (value) => {
        this.activeChannelTitle = value;
      });

    this.channelService.channelUserArrayEmitter.subscribe((users) => {
      
      console.log(users);
      this.members = users;
      this.countsOfMembers = this.members.length;
    });
   
  }

  openAddMemberDialog(){
    this.dialog.open(DialogAddMemberComponent);
  }
}
