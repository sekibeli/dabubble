import { Component } from '@angular/core';
import { MatDialogRef , MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';


@Component({
  selector: 'app-dialog-show-channeluser',
  templateUrl: './dialog-show-channeluser.component.html',
  styleUrls: ['./dialog-show-channeluser.component.scss']
})
export class DialogShowChanneluserComponent {
 members;
constructor( public dialogRef: MatDialogRef<DialogShowChanneluserComponent> , private channelService: ChannelService){
  this.members = this.channelService.currentChannelUserArray;
}


openProfile(){}
}
