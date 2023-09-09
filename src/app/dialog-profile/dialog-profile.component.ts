import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { DrawerService } from '../services/drawer.service';
import { BehaviorSubject } from 'rxjs';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { User } from '../models/user.class';
import { ChooseAvatarComponent } from '../choose-avatar/choose-avatar.component';
import { DialogEditImageComponent } from '../dialog-edit-image/dialog-edit-image.component';

@Component({
  selector: 'app-dialog-profile',
  templateUrl: './dialog-profile.component.html',
  styleUrls: ['./dialog-profile.component.scss']
})
export class DialogProfileComponent {
  me: boolean = true;
  user: any;
  isCurrentUser: boolean = false;


  constructor(public dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any, public messageService: MessageService, public drawerService: DrawerService, public dialog: MatDialog) {
    this.isCurrentUser = (this.data.user['id'] === localStorage.getItem('currentUserID')) && (localStorage.getItem('currentUserID') != 'bF3PiLI4bbZMKVs6ljqfofu6HoU2');
    localStorage.setItem('directMessage', 'true');
    localStorage.setItem('channelMessage', 'false');
    localStorage.setItem('threadMessage', 'false');
    this.user = data;
    this.checkIfItIsMe(data);
  }


  checkIfItIsMe(user) {
    let _user: string;
    if (user.user instanceof BehaviorSubject) {
      _user = user.user.getValue();
      this.me = (_user['id'] == localStorage.getItem('currentUserID'));
    }
    else {
      _user = user.user['id'];
      this.me = (_user == localStorage.getItem('currentUserID') && _user != 'bF3PiLI4bbZMKVs6ljqfofu6HoU2');
    }
  }


  openEditUser(user:User) {
    const dialogConfig = new MatDialogConfig();

    if (this.drawerService.isSmallScreen) {
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }
    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogEditUserComponent, dialogConfig);
    dialogRef.componentInstance.user = this.user.value;
  }


  openChooseAvatar() {
    const dialogConfig = new MatDialogConfig();

    if (this.drawerService.isSmallScreen) {
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }

    const dialogRef = this.dialog.open(DialogEditImageComponent, dialogConfig);
    dialogRef.componentInstance.user = this.user;
    this.dialogRef.close();
  }
}
