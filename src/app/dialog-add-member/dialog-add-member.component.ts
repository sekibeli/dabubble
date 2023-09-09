import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from '../services/channel.service';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { Firestore, collection, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';


@Component({
  selector: 'app-dialog-add-member',
  templateUrl: './dialog-add-member.component.html',
  styleUrls: ['./dialog-add-member.component.scss']
})
export class DialogAddMemberComponent implements OnInit, OnDestroy {
  unsubscribeUser: Subscription;
  unsubscribeChannel: Subscription;
  firestore: Firestore = inject(Firestore)
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  users;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  notChosen: boolean = true;
  chosenUser: User;
  channel: Channel;
  public channelTitle: string;
  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>, private channelService: ChannelService) {
  }

  ngOnInit() {
    this.unsubscribeUser = combineLatest([this.startobs, this.endobs]).subscribe((value) => {
      this.searchUserInFirestore(value[0], value[1]).then((user) => {
        this.users = user.docs.map(doc => doc.data());
      });
    });

    this.unsubscribeChannel = this.channelService.displayedChannel.subscribe((channel) => {
      this.channel = channel;
    });
  }


  addMemberToChannel() {
    this.channelService.addMemberToChannel(this.channel['id'], this.chosenUser['id']);
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
    this.unsubscribeUser.unsubscribe();
    this.unsubscribeChannel.unsubscribe();
  }


}
