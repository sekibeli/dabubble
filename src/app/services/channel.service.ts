import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, merge, mergeAll } from 'rxjs';
import { User } from '../models/user.class';

@Injectable({
   providedIn: 'root'
})
export class ChannelService implements OnInit, OnDestroy {
   firestore: Firestore = inject(Firestore)
   channelUser: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
   channelUserIDArray;
   channelUserArrayEmitter = new EventEmitter<any>();

   currentChannelUserArray;
   activeChannelTitle = new EventEmitter<string>();
   activeChannelID = new EventEmitter<string>();

   constructor(private userService: UserService) {

   }

   getChannels() {
      const collRef = collection(this.firestore, 'channels');
      const docChannel = collectionData(collRef, { idField: 'id' });
      return docChannel;
   }

   ngOnInit() {

   }
   pushActiveChannel(title, id) {
      this.activeChannelTitle.emit(title);
     
      this.getMembersOfChannel(id).subscribe((value)=> {
         this.channelUserIDArray = value;
         this.getMembersData(this.channelUserIDArray);
         console.log('der erste Output:', this.channelUserIDArray);
      });
   
   }

getMembersData(userArray){
   // console.log('Länge', userArray);
   let fetchCount = userArray.length;
  let usersArray = [];
  
   userArray.forEach(element => {
      this.userService.getCurrentUser(element['id']).subscribe((user) => {
         usersArray.push(user);
         fetchCount--;
   
         if (fetchCount === 0) {
            this.currentChannelUserArray = usersArray;
            console.log('zweiter Output', this.currentChannelUserArray);
           this.channelUserArrayEmitter.emit(this.currentChannelUserArray);
         }
   
      });
   });

  

}



   getMembersOfChannel(channel) {
      const collRef = collection(this.firestore, 'channels', channel, 'members');
      const docRef = collectionData(collRef, { idField: 'id' });
      return docRef;

   }

   // getMembersTest(channel) {
   //    let usersArray = [];

   //    const collRef = collection(this.firestore, 'channels', channel, 'members');
   //    const docRef = collectionData(collRef, { idField: 'id' });

   //    docRef.subscribe((value) => {
   //       let fetchCount = value.length;

   //       value.forEach((element) => {
       
   //         this.userService.getCurrentUser(element['id']).subscribe((user) => {
   //             usersArray.push(user);
   //             fetchCount--;

   //             if (fetchCount === 0) {
   //                this.channelUser.next(usersArray);
                 
   //             }

   //          });

   //       });
   //    }
   //    )
   //    this.currentChannelUser.emit(this.channelUser)
   //    console.log('channeluser:', this.channelUser);
     
   //    return this.channelUser;
   // }

   ngOnDestroy(): void {
   
      console.log('zerstört');
   }

}
