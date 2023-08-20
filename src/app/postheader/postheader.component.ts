import { ChangeDetectorRef, Component, HostListener, OnInit, inject, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { DialogShowChanneluserComponent } from '../dialog-show-channeluser/dialog-show-channeluser.component';

import { DialogShowChannelComponent } from '../dialog-show-channel/dialog-show-channel.component';

import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-postheader',
  templateUrl: './postheader.component.html',
  styleUrls: ['./postheader.component.scss']
})
export class PostheaderComponent implements OnInit, OnDestroy {
  unsub;
  firestore: Firestore = inject(Firestore);
  isSmallScreen;
  members: string[]; //Array mit UserIDs der Mitglieder eines Channels
  countsOfMembers; // Anzahl der Mitglieder eines Channels
  currentChannelUser;
  currentChannel: BehaviorSubject<any> = new BehaviorSubject<any>(null); //
  // currentChannelID: string;
  currentChannelData: any; 
  
  constructor(public channelService: ChannelService, public userService: UserService, public dialog: MatDialog, private changeDetect: ChangeDetectorRef) {
    this.checkScreenSize();

  

  }

  ngOnInit() {
    this.unsub =  this.channelService.currentChannelUserArray$.subscribe(members => {
      this.members = members;
      console.log('members:', members);
      console.log('observableMembers:', this.channelService.currentChannelUserArray$);
      this.countsOfMembers = members.length;
      this.changeDetect.detectChanges();
    });
 
    this.channelService.activeChannel.subscribe((channel) => {  // Übergabe des ganzen channel Objekts
      
      this.currentChannel.next(channel); // Behavior Subject
      this.currentChannelData = this.currentChannel.getValue();
      console.log('channel:', this.currentChannelData);
      console.log('Ausgabe:', this.currentChannel);


    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.members) {
  //     this.members = changes.members.currentValue;
  //     this.countsOfMembers = this.members.length;
  //   }
  // }

  openAddMemberDialog(activeChannelTitle: string) {
 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };
    dialogConfig.data = { channelTitle: activeChannelTitle };
    const dialogRef = this.dialog.open(DialogAddMemberComponent, dialogConfig);
    dialogRef.componentInstance.channelTitle = this.currentChannelData['title'];
  }

  openShowMembersDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };

    this.dialog.open(DialogShowChanneluserComponent, dialogConfig);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 600) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }
  openShowChannelInformation() {
    this.changeDetect.detectChanges();
    this.checkScreenSize();
    const dialogConfig = new MatDialogConfig();
    if (this.isSmallScreen) {

      dialogConfig.width = '100vw';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.height = '100vh';
      

    }
    console.log('small:', this.isSmallScreen);
    dialogConfig.data = {
      currentChannelData: this.currentChannelData, 
      isSmallScreen: this.isSmallScreen,
      members: this.members
    };
    this.dialog.open(DialogShowChannelComponent, dialogConfig);

  }

ngOnDestroy(){
  this.unsub.unsubscribe();
}
}
