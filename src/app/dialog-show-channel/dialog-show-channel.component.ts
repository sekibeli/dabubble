import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef,} from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { DrawerService } from '../services/drawer.service';

import { ChannelService } from '../services/channel.service';
import { Router } from '@angular/router';
import { Channel } from '../models/channel.class';

@Component({
  selector: 'app-dialog-show-channel',
  templateUrl: './dialog-show-channel.component.html',
  styleUrls: ['./dialog-show-channel.component.scss']
})
export class DialogShowChannelComponent implements OnDestroy{
  // channel;
  unsubscribe;
  editDescription = false;
  editTitle = false;
  originalChannel;
  currentChannel;
  createdBy!: string;
  isSmallScreen;
  members;
  userIsMember!: boolean;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private channelService: ChannelService, public dialogRef: MatDialogRef<DialogShowChannelComponent>, private userService: UserService, private dialog: MatDialog, private drawerService: DrawerService, private cd: ChangeDetectorRef, private route:Router){
    // console.log(data);
    this.originalChannel = JSON.parse(JSON.stringify(this.data.currentChannelData));
   this.currentChannel = data.currentChannelData;
   this.isSmallScreen = data.isSmallScreen;
  //  console.log(this.currentChannel);
   
    this.members = data.members;
    dialogRef.updateSize('100%');
this.unsubscribe = this.userService.getCurrentUser(data.currentChannelData['createdBy']).subscribe((value)=>{
      // console.log(value);
      this.createdBy = value['username'];
      // console.log(this.createdBy);
    });
    this.exitOrJoin(data.currentChannelData);
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }
  exitChannel(){
    this.channelService.deleteMemberFromChannel(this.currentChannel['id'], localStorage.getItem('currentUserID'));
    const unsub = this.channelService.getChannelsWhereCurrentUserIsMember(localStorage.getItem('currentUserID')).subscribe((value)=>{
      console.log(value);
      setTimeout(() => {
        console.log('auf zu:', value[0]);
        this.channelService.pushActiveChannel(value[0]);
        this.route.navigateByUrl('/home/channel/'+ value[0]['id'])
      }, 100);
      
    });
    this.dialogRef.close();
    
  }


editChannelTitle(){
  this.editTitle = true;
}

editChannelDescription(){
  this.editDescription = true;
}

adjustHeight(event: any): void {
  const textarea = event.target;
  textarea.style.height = 'auto'; // Reset height to auto first
  textarea.style.height = textarea.scrollHeight + 'px';
}

  
  closeShowChannel(){
    if(this.editDescription || this.editTitle){
      this.cancel();
    }
    this.dialogRef.close();
  }

  cancel(){
    Object.assign(this.data.currentChannelData, this.originalChannel);
      this.cd.detectChanges();
  
    this.dialogRef.close();
    
   
  }
 async updateChannel(){
    // const checkTitle = await this.channelService.checkChannelTitles(this.data.currentChannelData['title']);
    // if (!checkTitle){
      
    this.channelService.updateChannel(this.data.currentChannelData['id'], this.data.currentChannelData['title'], this.data.currentChannelData['description']);
    // this.dialogRef.close();
    // } else {
    //   Object.assign(this.data.currentChannelData, this.originalChannel);
    //   this.cd.detectChanges();
    //   alert('Diesen Channel gibt es schon. Bitte wähle einen anderen Namen.')
      
    // }
   this.editDescription = false;
   this.editTitle = false;
   
  }
  exitOrJoin(channel: Channel){
    this.channelService.checkIfUserIsAlreadyMemberOfChannel(channel['id'], localStorage.getItem('currentUserID')).then(check => {
      // console.log('checkk:', check);
      this.userIsMember = check;
    })
    
  }

  joinChannel(){
    this.channelService.addMemberToChannel(this.currentChannel['id'], localStorage.getItem('currentUserID'));
    this.dialogRef.close();
  }

  

  
}
