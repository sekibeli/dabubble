import { Component, OnInit, inject } from '@angular/core';
import { DocumentData, Firestore, collection, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { Subject, combineLatest } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';
import { DialogShowChannelComponent } from '../dialog-show-channel/dialog-show-channel.component';
import { ChannelService } from '../services/channel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-message-header',
  templateUrl: './new-message-header.component.html',
  styleUrls: ['./new-message-header.component.scss']
})
export class NewMessageHeaderComponent implements OnInit {

  firestore: Firestore = inject(Firestore);
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  notChosen = true;
  chosenUser;
  search = false;
  users;
  result;
  isSmallScreen;

  channelID;
  authorID;

  message: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })


  constructor(public dialog: MatDialog, private drawerService: DrawerService, private channelService: ChannelService) { }
  ngOnInit() {
    console.log('für mobil:', this.isSmallScreen);

    combineLatest([this.startobs, this.endobs]).subscribe((value) => {
      this.searchInFirestore(value[0], value[1]).then((items) => {
        this.users = items;
        console.log(items);
        this.result = this.separateUsersAndChannels(items);
        console.log('USER', this.result.users);
        console.log('CHANNEL', this.result.channels, this.result.channels.length);
      })
        .catch(error => {
          console.error("Error fetching data: ", error);
        });
    })

  }

  searchMember($event) {
    this.search = true;
    let q = $event.target.value;

    if (q.startsWith('#')) {
      console.log('beginnt mit #', q);
      q = q.substring(1);
      console.log('beginnt mit #', q);
      this.searchInUserCollection(q);
    } else if (q.startsWith('@')){
      q = q.substring(1);
      this.searchInChannelsCollection(q)
    } else
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff");
  }


  chooseNewMember(user: User) {
    this.chosenUser = user;
    console.log(user);
    this.notChosen = false;
    this.chosenUser = user;
  }

 
  async searchInUserCollection(q) {
 
    const usersCollRef = collection(this.firestore, 'users');
    const usersQueryRef = query(usersCollRef, orderBy('username'), limit(10), startAt(q), endAt(q + "\uf8ff"));  //  orderBy('username'),
    const usersDocRef = await getDocs(usersQueryRef);

  }

  async searchInChannelsCollection(q){
    const channelsCollRef = collection(this.firestore, 'channels');
    const channelsQueryRef = query(channelsCollRef, orderBy('title'), limit(10), startAt(q), endAt(q + "\uf8ff")); //  orderBy('title'),
    const channelsDocRef = await getDocs(channelsQueryRef);
  
  }

  async searchInFirestore(start, end) {

    const usersCollRef = collection(this.firestore, 'users');
    const usersQueryRef = query(usersCollRef, orderBy('username'), limit(10), startAt(start), endAt(end));  //  orderBy('username'),
    const usersDocRef = await getDocs(usersQueryRef);

   
    const channelsCollRef = collection(this.firestore, 'channels');
    const channelsQueryRef = query(channelsCollRef, orderBy('title'), limit(10), startAt(start), endAt(end)); //  orderBy('title'),
    const channelsDocRef = await getDocs(channelsQueryRef);


 
    const combinedResults = [];
    usersDocRef.forEach(doc => {
      combinedResults.push(doc.data());
    });

    channelsDocRef.forEach(doc => {
     
      const channelData = doc.data() as DocumentData;
      const channelWithId = { id: doc.id, ...channelData }; 
      combinedResults.push(channelWithId);
    });

    return combinedResults;
  }

  separateUsersAndChannels(jsonArray) {
    console.log(jsonArray);
  
    const users = jsonArray.filter((jsonObject) => 'username' in jsonObject);


    const channels = jsonArray.filter((jsonObject) => 'title' in jsonObject);

  
    return { users, channels };
  }


  openProfile(user) {
    const dialogConfig = new MatDialogConfig();
    if (this.drawerService.isSmallScreen) {

   
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';


    }

    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;
  }

  showChannel(channel) {

    this.openShowChannelInformation(channel)
  }


  openShowChannelInformation(channel) {
  
    console.log(channel);
    console.log(this.drawerService.isSmallScreen);
    const dialogConfig = new MatDialogConfig();
    if (this.drawerService.isSmallScreen) {

      dialogConfig.width = '100vw';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.height = '100vh';


    }
   
    dialogConfig.data = {
      currentChannelData: channel,
      isSmallScreen: this.drawerService.isSmallScreen,

     
    };
    this.dialog.open(DialogShowChannelComponent, dialogConfig);

  }

  chooseUser(user) {
    this.searchterm = user['username'];
    this.search = false;
  }

  chooseChannel(channel) {
    console.log(channel);
    if (channel['members'].includes(localStorage.getItem('currentUserID'))) {
      this.searchterm = channel['title'];
      this.search = false;
    } else {
      console.log('ERst Channel beitreten');
      this.openShowChannelInformation(channel);
    }

  }

  sendMessage(channelID, authorID, message) { }





}




