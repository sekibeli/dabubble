import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, collection, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { ChannelService } from '../services/channel.service';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';


@Component({
  selector: 'app-dialog-add-member-to-new-channel',
  templateUrl: './dialog-add-member-to-new-channel.component.html',
  styleUrls: ['./dialog-add-member-to-new-channel.component.scss']
})
export class DialogAddMemberToNewChannelComponent implements OnInit, OnDestroy {
  unsubscribeLatest:Subscription;
  firestore: Firestore = inject(Firestore);
  selectedOption: string;
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  users;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  notChosen: boolean = true;
  chosenUser;
  public channel: Channel;
  
  
  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>, private channelService: ChannelService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.unsubscribeLatest = combineLatest([this.startobs, this.endobs]).subscribe((value) => {
      this.searchUserInFirestore(value[0], value[1]).then((user) => {
        this.users = user.docs.map(doc => doc.data());
      });
    });
   }


  addMemberToChannel() {
    if (this.selectedOption == 'option1') {
      this.channelService.getMembersOfChannelAndPushInNewChannel(this.data.channel['id'])
    } else {
      this.channelService.addMemberToChannel(this.data.channel['id'], this.chosenUser['id']);
       }
    this.dialogRef.close();
  }


  searchMember($event) {
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff")
  }


  chooseNewMember(user: User) {
    this.chosenUser = user;
    this.notChosen = false;
  }


  searchUserInFirestore(start, end) {
    const collRef = collection(this.firestore, 'users');
    const queryRef = query(collRef, orderBy('username'), limit(10), startAt(start), endAt(end));
    const docRef = getDocs(queryRef);
    return docRef;
  }


  removeChosenUser() {
    this.notChosen = true;
    this.chosenUser = null;
  }

  ngOnDestroy(): void {
    this.unsubscribeLatest.unsubscribe();
  }
}
