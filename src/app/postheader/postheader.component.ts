import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../services/user.service';
import { MatDialogRef , MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { DialogShowChanneluserComponent } from '../dialog-show-channeluser/dialog-show-channeluser.component';

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
// this.countsOfMembers = this.members.length;
    this.channelService.activeChannelID.subscribe((value) => {
      this.activeChannelID.next(value);
    });
  }

  ngOnInit() {
    this.channelService.pushActiveChannel('Angular', '9Gwz1Ce763caWx5FCBZL' );

    this.channelService.activeChannelTitle.subscribe(
      (value) => {
        this.activeChannelTitle = value;
        console.log('Holmes3', this.activeChannelTitle);
      });

    this.channelService.channelUserArrayEmitter.subscribe((users) => {
            
      this.members = users;
      this.countsOfMembers = this.members.length;
    });
   
  }

  openAddMemberDialog(activeChannelTitle: string){

    // this.channelService.openAddMemberDialog(activeChannelTitle);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };
dialogConfig.data = { channelTitle: activeChannelTitle};
   const dialogRef =  this.dialog.open(DialogAddMemberComponent, dialogConfig);
   dialogRef.componentInstance.channelTitle = this.activeChannelTitle;
  }

  openShowMembersDialog(){
    const dialogConfig = new MatDialogConfig();
  dialogConfig.position = {
    top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
    right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
  };

  
    this.dialog.open(DialogShowChanneluserComponent, dialogConfig);
  }
}
