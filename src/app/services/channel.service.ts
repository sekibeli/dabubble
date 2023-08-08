import { EventEmitter, Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, merge, mergeAll } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class ChannelService implements OnInit {
   firestore: Firestore = inject(Firestore)
   channelUser: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
   // channelID: string ;

   // channels;

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
      this.activeChannelID.emit(id);

   }


   getMembers(channel) {
      const collRef = collection(this.firestore, 'channels', channel, 'members');
      const docRef = collectionData(collRef, { idField: 'id' });
      return docRef;

   }

   getMembersTest(channel) {
      let usersArray = [];

      const collRef = collection(this.firestore, 'channels', channel, 'members');
      const docRef = collectionData(collRef, { idField: 'id' });

      docRef.subscribe((value) => {
         let fetchCount = value.length;

         value.forEach((element) => {
       
            this.userService.getCurrentUser(element['id']).subscribe((user) => {
               usersArray.push(user);
               fetchCount--;

               if (fetchCount === 0) {
                  this.channelUser.next(usersArray);
               }

            });

         });
      }
      )
      return this.channelUser;
   }

}
