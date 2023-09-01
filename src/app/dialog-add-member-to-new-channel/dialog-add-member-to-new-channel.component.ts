import { Component, Inject, inject } from '@angular/core';
import { Firestore, collection, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, combineLatest } from 'rxjs';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import {MatRadioModule} from '@angular/material/radio';


@Component({
  selector: 'app-dialog-add-member-to-new-channel',
  templateUrl: './dialog-add-member-to-new-channel.component.html',
  styleUrls: ['./dialog-add-member-to-new-channel.component.scss']
})
export class DialogAddMemberToNewChannelComponent {
  firestore: Firestore = inject(Firestore);
  selectedOption: string;

  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  username;
users;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  notChosen = true;
  chosenUser;
  channel;


public channelTitle;
  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>, private channelService: ChannelService, private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: any) { 
   
   this.channel = data.channel;
   console.log(data.channel);
    // this.channelService.activeChannelTitle.subscribe((value)=>{
    // console.log(value);
    // })
    // this.channelTitle = this.data.activeChannelTitle;
    // console.log('addMember Component', this.channelTitle);
  }

  ngOnInit() {
    combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
      this.searchUserInFirestore(value[0], value[1]).then((user)=>{
        this.users = user.docs.map(doc => doc.data());
      })
      // console.log(this.users);
    })
  
    
  }
  addMemberToChannel() {

    // let channelID = this.channelService.currentChannelID;
    if(this.selectedOption == 'option1'){
      this.channelService.getMembersOfChannelAndPushInNewChannel(this.data.channel['id'])

    } else {
      this.channelService.addMemberToChannel(this.data.channel['id'], this.chosenUser['id']);
      this.channelService.addMemberToChannel(this.data.channel['id'], localStorage.getItem('currentUserID'));
    }
   

   this.dialogRef.close();

  }


  searchMember($event) {
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff")
  }

  // addNewMember() { }

  chooseNewMember(user:User){
    this.chosenUser = user;
    // console.log(user);
    this.notChosen = false;
    this.chosenUser = user;
  }

  searchUserInFirestore(start, end) {
    const collRef = collection(this.firestore, 'users');
    const queryRef = query(collRef, orderBy('username'), limit(10), startAt(start), endAt(end));
    const docRef = getDocs(queryRef);
    return docRef;
   

  }

  removeChosenUser(){
    this.notChosen = true;
    this.chosenUser = null;
  }
}
