import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef , MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';


@Component({
  selector: 'app-dialog-show-channeluser',
  templateUrl: './dialog-show-channeluser.component.html',
  styleUrls: ['./dialog-show-channeluser.component.scss']
})
export class DialogShowChanneluserComponent implements OnInit, OnDestroy {
 members;
 activeTitle;
 unsub;
constructor( public dialogRef: MatDialogRef<DialogShowChanneluserComponent> , public channelService: ChannelService, public dialog: MatDialog, private drawerService: DrawerService){

  
  this.members = this.channelService.currentChannelUserArray;

  this.unsub = this.channelService.activeChannelTitle.subscribe((value)=>{
    console.log(value);
    this.activeTitle = value;
  
  });


}

ngOnInit(){}

openAddMember(){
  
  const dialogConfig = new MatDialogConfig();
  dialogConfig.position = {
    top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
    right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
  };
dialogConfig.data = { channelTitle: this.channelService.currentChannelTitle }
 const dialogRef =  this.dialog.open(DialogAddMemberComponent, dialogConfig);
 dialogRef.componentInstance.channelTitle = this.channelService.currentChannelTitle;

  this.dialogRef.close();

  
 
}

openProfile(user){
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


