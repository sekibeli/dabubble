import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-dialog-add-member',
  templateUrl: './dialog-add-member.component.html',
  styleUrls: ['./dialog-add-member.component.scss']
})
export class DialogAddMemberComponent {

  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>, private channelService: ChannelService){}


  addMemberToChannel(channelID, user){
    // this.channelService.addMemberToChannel(channelID, user);

  }
}
