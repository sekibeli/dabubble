import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';
import { FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Firestore, QuerySnapshot, collection, docData, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';


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
channelTitle;
  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>, private channelService: ChannelService, private userService: UserService) { 
    this.channelService.activeChannelTitle.subscribe((value)=>{
    console.log(value);
    })
    console.log('addMember Component');
  }

  ngOnInit() {
    combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
      this.searchUserInFirestore(value[0], value[1]).then((user)=>{
        this.users = user.docs.map(doc => doc.data());
      })
      console.log(this.users);
    })
  
    
  }
  addMemberToChannel(channelID, user) {
    // this.channelService.addMemberToChannel(channelID, user);
  }


  searchMember($event) {
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff")
  }

  addNewMember() { }

  searchUserInFirestore(start, end) {
    const collRef = collection(this.firestore, 'users');
    const queryRef = query(collRef, orderBy('username'), limit(3), startAt(start), endAt(end));
    const docRef = getDocs(queryRef);
    return docRef;
   

  }
}
