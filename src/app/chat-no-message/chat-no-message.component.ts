import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-chat-no-message',
  templateUrl: './chat-no-message.component.html',
  styleUrls: ['./chat-no-message.component.scss']
})
export class ChatNoMessageComponent implements OnInit {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUserID: string;

  constructor(public messageService: MessageService, public userService: UserService, private dialog: MatDialog, private drawerService: DrawerService) {
    this.currentUserID = localStorage.getItem('currentUserID');
    const currentUser = JSON.parse(localStorage.getItem('currentChatUser'));
    this.user.next(currentUser);
  }


  ngOnInit(): void {
    this.messageService.activeChatUser.subscribe((value) => {
      this.user.next(value);
    });
    if (this.user['id']) {
      this.userService.getCurrentUser(this.user['id']).subscribe((value) => {  // holt sich immer die aktuellen Daten aus dem Firestore
        this.user.next(value as User);
      })
    }
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

  }
}
