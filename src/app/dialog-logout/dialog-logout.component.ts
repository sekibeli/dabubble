import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { User } from '../models/user.class';
import { Router } from '@angular/router';
import { DrawerService } from '../services/drawer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-logout',
  templateUrl: './dialog-logout.component.html',
  styleUrls: ['./dialog-logout.component.scss']
})
export class DialogLogoutComponent implements OnDestroy{
  unsubscribeUser: Subscription;
  currentUser: string = '';
  user: User;

  constructor(private afAuth: AngularFireAuth, private userService: UserService, public dialogRef: MatDialogRef<DialogProfileComponent>, public dialog: MatDialog, private route: Router, private drawerService: DrawerService) {
    this.currentUser = localStorage.getItem('currentUserID') || '';

    this.unsubscribeUser = this.userService.getCurrentUser(this.currentUser).subscribe((value) => {
      this.user = value;
    });
  }

  logUserOut() {


    this.afAuth.signOut().then(() => {

      localStorage.removeItem('currentChannelID');
      localStorage.removeItem("currentChatID");
      localStorage.removeItem("currentUserID");
      localStorage.removeItem("directMessage");
      localStorage.removeItem("currentChatLength");
      localStorage.removeItem("threadMessage");
      localStorage.removeItem("currentChatUser");
      localStorage.removeItem("channelMessage");
      localStorage.removeItem("currentUserName");
      return this.userService.setUserStatus(this.currentUser, false);


    }).then(() => {
      localStorage.setItem('directMessage', 'false');
      localStorage.setItem('currentUserID', '');
     
      setTimeout(() => {
        location.reload();
      }, 1300);

    })
      .catch((err) => {
     });


  }

  openProfile(user: User) {
    const dialogConfig = new MatDialogConfig();

    if (this.drawerService.isSmallScreen) {

      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }

    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = this.user;
    this.dialogRef.close();
  }


  ngOnDestroy(): void {
    this.unsubscribeUser.unsubscribe();
  }
}
