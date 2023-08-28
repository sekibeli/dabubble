import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef , MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';


@Component({
  selector: 'app-dialog-show-channeluser',
  templateUrl: './dialog-show-channeluser.component.html',
  styleUrls: ['./dialog-show-channeluser.component.scss']
})
export class DialogShowChanneluserComponent implements OnInit, OnDestroy {
 members;
 activeTitle!: string;
 unsub;
 channel!:Channel;
 serviceChannel!:Channel;
constructor( public dialogRef: MatDialogRef<DialogShowChanneluserComponent> , public channelService: ChannelService, public dialog: MatDialog, private drawerService: DrawerService, @Inject(MAT_DIALOG_DATA) public data: any){

  
  this.members = this.channelService.currentChannelUserArray;

  this.unsub = this.channelService.activeChannelTitle.subscribe((value)=>{
    // console.log(value);
    this.activeTitle = value;
  
  });


}

ngOnInit(){
console.log('test1', this.data.serviceChannel);
// console.log('test2', this.serviceChannel);
}

openAddMember(){
  
  const dialogConfig = new MatDialogConfig();
  dialogConfig.position = {
    top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
    right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
  };
dialogConfig.data = { 
  channelTitle: this.channelService.currentChannelTitle,
channel: this.data.channel }
 const dialogRef =  this.dialog.open(DialogAddMemberComponent, dialogConfig);
 dialogRef.componentInstance.channelTitle = this.channelService.currentChannelTitle;
 dialogRef.componentInstance.channel = this.data.channel; 

  this.dialogRef.close();

  
 
}

openProfile(user:User){
  const dialogConfig = new MatDialogConfig();
  // this.dialog.open(DialogProfileComponent, user)

  if (this.drawerService.isSmallScreen) {

    // dialogConfig.width = '95vw';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '90vh';
    

  }

  dialogConfig.data = { user: user};
  // dialogConfig.width = '95vw';
  const dialogRef =  this.dialog.open(DialogProfileComponent, dialogConfig);
  dialogRef.componentInstance.user = user;

  this.dialogRef.close();
}

ngOnDestroy(): void {
  if(this.unsub){
    this.unsub.unsubscribe();
  }
}
}


