import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dialog-show-channeluser',
  templateUrl: './dialog-show-channeluser.component.html',
  styleUrls: ['./dialog-show-channeluser.component.scss']
})
export class DialogShowChanneluserComponent implements OnInit, OnDestroy {
  members;
  activeTitle!: string;
  unsub: Subscription;
  channel!: Channel;
  serviceChannel!: Channel;
  constructor(public dialogRef: MatDialogRef<DialogShowChanneluserComponent>, public channelService: ChannelService, public dialog: MatDialog, private drawerService: DrawerService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.members = this.channelService.currentChannelUserArray;
  }

  ngOnInit() {
  }

  openAddMember() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };

    const dialogRef = this.dialog.open(DialogAddMemberComponent, dialogConfig);
    this.dialogRef.close();
  }

  openProfile(user: User) {
    const dialogConfig = new MatDialogConfig();

    if (this.drawerService.isSmallScreen) {
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }
    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;
    this.dialogRef.close();
  }


  ngOnDestroy(): void {
    if (this.unsub) {
      this.unsub.unsubscribe();
    }
  }
}


