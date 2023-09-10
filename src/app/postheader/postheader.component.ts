import { ChangeDetectorRef, Component, HostListener, OnInit, inject, OnChanges, SimpleChanges, OnDestroy, Input } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { DialogShowChanneluserComponent } from '../dialog-show-channeluser/dialog-show-channeluser.component';

import { DialogShowChannelComponent } from '../dialog-show-channel/dialog-show-channel.component';

import { Firestore } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Component({
  selector: 'app-postheader',
  templateUrl: './postheader.component.html',
  styleUrls: ['./postheader.component.scss']
})
export class PostheaderComponent implements OnInit, OnDestroy {

  unsub;
  firestore: Firestore = inject(Firestore);
  isSmallScreen;
  members: User[]; //Array mit UserIDs der Mitglieder eines Channels
  countsOfMembers; // Anzahl der Mitglieder eines Channels
  currentChannelUser;
  currentChannel: BehaviorSubject<any> = new BehaviorSubject<any>(null); //
  channel;
  currentChannelData: any; // Inhalt von currentChannel
  constructor(public channelService: ChannelService, public userService: UserService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.checkScreenSize();
  }

  ngOnInit() {

    this.channelService.displayedChannel.subscribe((channel) => {  // Übergabe des ganzen channel Objekts
      this.channel = channel;
    });


    this.unsub = this.channelService.currentChannelUserArraySubject.subscribe(members => {
      this.members = members;
      this.countsOfMembers = members.length;
    });
  }

  openAddMemberDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };

    this.dialog.open(DialogAddMemberComponent, dialogConfig);
  }

  openShowMembersDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };
    dialogConfig.data = {
      serviceChannel: this.channelService.displayedChannel
    };
    const dialogRef = this.dialog.open(DialogShowChanneluserComponent, dialogConfig);
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreenSize();
  }


  checkScreenSize() {
    if (window.innerWidth < 650) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }


  openShowChannelInformation(channel) {

    this.checkScreenSize();
    const dialogConfig = new MatDialogConfig();
    if (this.isSmallScreen) {

      dialogConfig.width = '100vw';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.height = '100vh';
    }

    dialogConfig.data = {
      currentChannelData: channel,
      isSmallScreen: this.isSmallScreen,
    };
    this.dialog.open(DialogShowChannelComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.unsub.unsubscribe();
  }
}