import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { DrawerService } from '../services/drawer.service';
import { ChannelService } from '../services/channel.service';
import { Router } from '@angular/router';
import { Channel } from '../models/channel.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-show-channel',
  templateUrl: './dialog-show-channel.component.html',
  styleUrls: ['./dialog-show-channel.component.scss']
})
export class DialogShowChannelComponent implements OnDestroy {
  unsubscribe: Subscription;
  editDescription: boolean = false;
  editTitle: boolean = false;
  originalChannel: Channel;
  currentChannel: Channel;
  createdBy!: string;
  isSmallScreen: boolean;
  members: any;
  userIsMember!: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private channelService: ChannelService, public dialogRef: MatDialogRef<DialogShowChannelComponent>, private userService: UserService, private dialog: MatDialog, private drawerService: DrawerService, private cd: ChangeDetectorRef, private route: Router) {

    this.originalChannel = JSON.parse(JSON.stringify(this.data.currentChannelData));
    this.currentChannel = data.currentChannelData;
    this.isSmallScreen = data.isSmallScreen;


    this.members = data.members;
    dialogRef.updateSize('100%');
    this.unsubscribe = this.userService.getCurrentUser(data.currentChannelData['createdBy']).subscribe((value) => {
      this.createdBy = value['username'];
    });
    this.exitOrJoin(data.currentChannelData);
  }


  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }


  exitChannel() {
    this.channelService.deleteMemberFromChannel(this.currentChannel['id'], localStorage.getItem('currentUserID'));
    const unsub = this.channelService.getChannelsWhereCurrentUserIsMember(localStorage.getItem('currentUserID')).subscribe((value) => {
      // console.log(value);
      setTimeout(() => {
        // console.log('auf zu:', value[0]);
        this.channelService.pushActiveChannel(value[0]);
        this.route.navigateByUrl('/home/channel/' + value[0]['id'])
      }, 100);
    });
    this.dialogRef.close();
  }


  editChannelTitle() {
    this.editTitle = true;
  }


  editChannelDescription() {
    this.editDescription = true;
  }


  adjustHeight(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to auto first
    textarea.style.height = textarea.scrollHeight + 'px';
  }


  closeShowChannel() {
    if (this.editDescription || this.editTitle) {
      this.cancel();
    }
    this.dialogRef.close();
  }


  cancel() {
    Object.assign(this.data.currentChannelData, this.originalChannel);
    this.cd.detectChanges();
    this.dialogRef.close();
  }


  async updateChannel() {
    this.channelService.updateChannel(this.data.currentChannelData['id'], this.data.currentChannelData['title'], this.data.currentChannelData['description']);
    this.editDescription = false;
    this.editTitle = false;
  }


  exitOrJoin(channel: Channel) {
    this.channelService.checkIfUserIsAlreadyMemberOfChannel(channel['id'], localStorage.getItem('currentUserID')).then(check => {
      this.userIsMember = check;
    })
  }


  joinChannel() {
    this.channelService.addMemberToChannel(this.currentChannel['id'], localStorage.getItem('currentUserID'));
    this.dialogRef.close();
  }
}
