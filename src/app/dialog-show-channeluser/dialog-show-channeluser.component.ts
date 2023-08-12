import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef , MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';


@Component({
  selector: 'app-dialog-show-channeluser',
  templateUrl: './dialog-show-channeluser.component.html',
  styleUrls: ['./dialog-show-channeluser.component.scss']
})
export class DialogShowChanneluserComponent implements OnInit, OnDestroy {
 members;
 activeTitle;
 unsub;
constructor( public dialogRef: MatDialogRef<DialogShowChanneluserComponent> , public channelService: ChannelService, public dialog: MatDialog){
  this.members = this.channelService.currentChannelUserArray;

  this.unsub = this.channelService.activeChannelTitle.subscribe((value)=>{
    console.log(value);
    this.activeTitle = value;
  
  })
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

openProfile(){}

ngOnDestroy(): void {
  if(this.unsub){
    this.unsub.unsubscribe();
  }
}
}


