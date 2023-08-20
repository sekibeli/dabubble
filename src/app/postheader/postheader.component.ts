import { Component, HostListener, OnInit, inject } from '@angular/core';
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
export class PostheaderComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  isSmallScreen;
  activeChannelTitle  ;
  activeChannelID: BehaviorSubject<string> = new BehaviorSubject<string>('null');
  members;
  countsOfMembers;
  currentChannelUser;
  currentChannel: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentChannelID: string;
  currentChannelData: any; 
  
  // = {
  //   createdBy: "xeLjLZJ7SYVREnmskY07GgKMwnx1",
  //   description: "Cooles Ding! Treibt einem nur etwas in den Wahnsinn ....",
  //   id: "9Gwz1Ce763caWx5FCBZL",
  //   members: ['20ftvvpCTuPl50KPTkwZgQ30KM52', 'bF3PiLI4bbZMKVs6ljqfofu6HoU2', 'DyGVMYTdzCXRsqa2VuBfavSbhvk2', '0NGEM9WCfKN1M2QfVQ1SvoCxpbm2'],
  //   title: "Angular"
  // };
  constructor(public channelService: ChannelService, public userService: UserService, public dialog: MatDialog) {
console.log('Hier:', this.currentChannelID);
console.log('Da:', this.activeChannelID.value);
    this.checkScreenSize();
    this.members = this.channelService.currentChannelUserArray;
    // this.countsOfMembers = this.members.length;
    this.channelService.activeChannelID.subscribe((value) => {
      this.activeChannelID.next(value);
    });

    this.channelService.activeChannel.subscribe((channel) => {  // Übergabe des ganzen channel Objekts
      this.currentChannel.next(channel); // Behavior Subject
      this.currentChannelData = this.currentChannel.getValue();
      console.log('channel:', this.currentChannelData);
      

    });



  }

  ngOnInit() {
    // this.channelService.pushActiveChannel('Angular', '9Gwz1Ce763caWx5FCBZL' );

    this.channelService.activeChannelTitle.subscribe(
      (value) => {
        this.activeChannelTitle = value;
        console.log('Holmes3', this.activeChannelTitle);
      });

    this.channelService.channelUserArrayEmitter.subscribe((users) => {

      this.members = users;
      this.countsOfMembers = this.members.length;
    });

   
  }

  openAddMemberDialog(activeChannelTitle: string) {

    // this.channelService.openAddMemberDialog(activeChannelTitle);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };
    dialogConfig.data = { channelTitle: activeChannelTitle };
    const dialogRef = this.dialog.open(DialogAddMemberComponent, dialogConfig);
    dialogRef.componentInstance.channelTitle = this.activeChannelTitle;
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


    // console.log('small:', this.isSmallScreen);
    // dialogConfig.data = {currentChannelData: this.currentChannelData};
    // this.dialog.open(DialogShowChannelComponent, dialogConfig);
  }


}
