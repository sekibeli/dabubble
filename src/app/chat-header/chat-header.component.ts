import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})

export class ChatHeaderComponent implements OnInit, OnDestroy {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUserID: string; // ID vom eingeloggten User
  unsubscribeUser: Subscription;
  unsubscribeActiveChatUser: Subscription;

  constructor(public messageService: MessageService, public userService: UserService, public dialog: MatDialog, private drawerService: DrawerService) {
    this.currentUserID = localStorage.getItem('currentUserID');
    const currentUser = JSON.parse(localStorage.getItem('currentChatUser'));
    this.user.next(currentUser); // Damit beim ersten Aufruf ein Wert da ist.
  }


  ngOnInit(): void {
    this.unsubscribeActiveChatUser = this.messageService.activeChatUser.subscribe((value) => {
      this.user.next(value);
    });
    if (this.user['id']) {
      this.unsubscribeUser = this.userService.getCurrentUser(this.user['id']).subscribe((value) => {  // holt sich immer die aktuellen Daten aus dem Firestore
        this.user.next(value as User);
      })
    }
  }

  openProfile(user) {
    const dialogConfig = new MatDialogConfig();
    if (this.drawerService.isSmallScreen) {

      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }

    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = this.user.value;
  }

  ngOnDestroy(): void {
    // this.unsubscribeUser.unsubscribe();
    // this.unsubscribeActiveChatUser.unsubscribe();
  }

}




