import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';
import { FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Firestore, QuerySnapshot, collection, docData, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../models/user.class';


@Component({
  selector: 'app-dialog-add-member',
  templateUrl: './dialog-add-member.component.html',
  styleUrls: ['./dialog-add-member.component.scss']
})
export class DialogAddMemberComponent implements OnInit {
  firestore: Firestore = inject(Firestore)
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  username;
users;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  notChosen = true;
  chosenUser;
public channelTitle;
  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>, private channelService: ChannelService, private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: any) { 
    
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
      console.log(this.users);
    })
  
    
  }
  addMemberToChannel() {
  
    let channelID = this.channelService.currentChannelID;
    this.channelService.addMemberToChannel(channelID, this.chosenUser.id);
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
    console.log(user);
    this.notChosen = false;
    this.chosenUser = user;
  }

  searchUserInFirestore(start, end) {
    const collRef = collection(this.firestore, 'users');
    const queryRef = query(collRef, orderBy('username'), limit(10), startAt(start), endAt(end));
    const docRef = getDocs(queryRef);
    return docRef;
   

  }
}
