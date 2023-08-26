import { Component, OnInit, inject } from '@angular/core';
import { DocumentData, Firestore, collection, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { Subject, combineLatest } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';
import { DialogShowChannelComponent } from '../dialog-show-channel/dialog-show-channel.component';
import { ChannelService } from '../services/channel.service';

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


constructor(public dialog: MatDialog, private drawerService: DrawerService, private channelService: ChannelService){}
ngOnInit() {
  console.log('für mobil:', this.isSmallScreen);
  // combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
  //   this.searchUserInFirestore(value[0], value[1]).then((user)=>{
  //     this.users = user.docs.map(doc => doc.data());
  //   })
  //   console.log(this.users);
  // })
  combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
    this.searchInFirestore(value[0], value[1]).then((items)=>{
      this.users = items;
      console.log(items);
      this.result = this.separateUsersAndChannels(items);
      console.log('USER',this.result.users);
      console.log('CHANNEL',this.result.channels, this.result.channels.length);
    })
    .catch(error => {
      console.error("Error fetching data: ", error);
    });
  })
  
  // console.log(this.result.users);   
  // console.log(this.result.channels);
}

  searchMember($event) {
    this.search = true;
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff")
  }

  // addNewMember() { }

  chooseNewMember(user:User){
    this.chosenUser = user;
    console.log(user);
    this.notChosen = false;
    this.chosenUser = user;
  }

  // searchUserInFirestore(start, end) {
  //   const collRef = collection(this.firestore, 'users');
  //   const queryRef = query(collRef, orderBy('username'), limit(10), startAt(start), endAt(end));
  //   const docRef = getDocs(queryRef);
  //   return docRef;
   

  // }

  async searchInFirestore(start, end) {
    // Suche in der 'users' Collection
    const usersCollRef = collection(this.firestore, 'users');
    const usersQueryRef = query(usersCollRef, limit(10), startAt(start), endAt(end));  //  orderBy('username'),
     const usersDocRef = await getDocs(usersQueryRef);
    
    // Suche in der 'channels' Collection
    const channelsCollRef = collection(this.firestore, 'channels');
    const channelsQueryRef = query(channelsCollRef,  limit(10), startAt(start), endAt(end)); //  orderBy('title'),
    const channelsDocRef = await getDocs(channelsQueryRef);
    
  
    // Kombiniere die Ergebnisse der beiden Queries
    const combinedResults = [];
    usersDocRef.forEach(doc => {
      combinedResults.push(doc.data());
    });
    
    channelsDocRef.forEach(doc => {
      // combinedResults.push(doc.data());
      const channelData = doc.data() as DocumentData;
      const channelWithId = { id: doc.id, ...channelData }; // Hier fügen Sie die ID zum Dokument hinzu
      combinedResults.push(channelWithId);
    });
  
    return combinedResults;
  }

separateUsersAndChannels(jsonArray) {
  console.log(jsonArray);
    // Filtert die JSON-Objekte, die ein 'username'-Feld haben, und schiebt sie in das 'users'-Array
    const users = jsonArray.filter((jsonObject) => 'username' in jsonObject);
  
    // Filtert die JSON-Objekte, die ein 'title'-Feld haben, und schiebt sie in das 'channels'-Array
    const channels = jsonArray.filter((jsonObject) => 'title' in jsonObject);
  
    // Gibt ein Objekt zurück, das die beiden separaten Arrays enthält
    return { users, channels };
  }
  

  openProfile(user){
    const dialogConfig = new MatDialogConfig();
    if (this.drawerService.isSmallScreen) {

      // dialogConfig.width = '95vw';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
      

    }

    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;
  }

  showChannel(channel){
   
    this.openShowChannelInformation(channel)
  }


  openShowChannelInformation(channel) {
    // this.changeDetect.detectChanges();
    // this.checkScreenSize();
    console.log(channel);
    console.log(this.drawerService.isSmallScreen);
    const dialogConfig = new MatDialogConfig();
    if (this.drawerService.isSmallScreen) {

      dialogConfig.width = '100vw';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.height = '100vh';
      

    }
    // console.log('small:', this.isSmallScreen);
    dialogConfig.data = {
      currentChannelData: channel, 
      isSmallScreen: this.drawerService.isSmallScreen,

      // members: this.members
    };
    this.dialog.open(DialogShowChannelComponent, dialogConfig);

  }

  
 }


