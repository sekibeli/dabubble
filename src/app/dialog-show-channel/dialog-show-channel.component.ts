import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,} from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dialog-show-channel',
  templateUrl: './dialog-show-channel.component.html',
  styleUrls: ['./dialog-show-channel.component.scss']
})
export class DialogShowChannelComponent {
  // channel;
  currentChannel;
  createdBy;
  isSmallScreen;
  members;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogShowChannelComponent>, private userService: UserService){
    console.log(data);
   
   this.currentChannel = data.currentChannelData;
   this.isSmallScreen = data.isSmallScreen;
   console.log(this.currentChannel);
   
    this.members = data.members;
    dialogRef.updateSize('100%');
    this.userService.getCurrentUser(data.currentChannelData['createdBy']).subscribe((value)=>{
      console.log(value);
      this.createdBy = value['username'];
    });

  }

  exitChannel(){}
}
