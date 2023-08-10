import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, arrayUnion, collection, collectionData, doc, docData, updateDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Subject, merge, mergeAll, takeUntil } from 'rxjs';
import { User } from '../models/user.class';

@Injectable({
   providedIn: 'root'
})
export class ChannelService implements OnInit, OnDestroy {
   private destroy$: Subject<void> = new Subject<void>();
   firestore: Firestore = inject(Firestore)
   channelUser: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
   channelUserIDArray;
   channelUserArrayEmitter = new EventEmitter<any>();
   
   currentChannelUserArray = [{

      active: false,
      email: "max@mustermann.de",
      id: "0NGEM9WCfKN1M2QfVQ1SvoCxpbm2",
      img: "../../assets/img/profile_img/avatar2.svg",
      username: "Max Musterfrau"
   }, {
      active: false,
      email: "java2011@me.com",
      id: "DyGVMYTdzCXRsqa2VuBfavSbhvk2",
      img: "../../assets/img/profile_img/Avatar.svg",
      username: "Julia Finsterwalder"
   }];
   activeChannelTitle = new EventEmitter<string>();
   activeChannelID = new EventEmitter<string>();

   constructor(private userService: UserService) {
      
      this.getInitials('9Gwz1Ce763caWx5FCBZL');
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

      this.getMembersOfChannel(id).subscribe((value) => {
         this.channelUserIDArray = value;
         this.getMembersData(this.channelUserIDArray);
         console.log('der erste Output:', this.channelUserIDArray);
      });
   }

   getMembersData(userArray) {
      this.currentChannelUserArray = [];
      let fetchCount = userArray.length;
      let usersArray = [];

      userArray.forEach(element => {
         this.userService.getCurrentUser(element['id']).pipe(takeUntil(this.destroy$)).subscribe((user) => {
            usersArray.push(user);
            fetchCount--;
            if (fetchCount === 0) {
               this.currentChannelUserArray = [];
               this.currentChannelUserArray = usersArray;
               console.log('zweiter Output', this.currentChannelUserArray);
               this.channelUserArrayEmitter.emit(this.currentChannelUserArray);
            }
         });
      });
   }

   getMembersDataTest(userArray) {
      this.currentChannelUserArray = [];
      let fetchCount = userArray.length;
      let usersArray = [];

      userArray.forEach(element => {
         this.userService.getCurrentUser(element['id']).pipe(takeUntil(this.destroy$)).subscribe((user) => {
            usersArray.push(user);
            fetchCount--;
            if (fetchCount === 0) {
               this.currentChannelUserArray = [];
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

getInitials(id){
   const data = this.getMembersOfChannel(id);
   data.subscribe((user)=>{
      console.log('test', user);
      this.channelUserIDArray = user;
      console.log(this.channelUserIDArray);
   })
}

   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }

   saveChannel(channel){
      const collRef = collection(this.firestore, 'channels');
      addDoc(collRef, channel.toJSON());
   }

   addMemberToChannel(channelID, user){
      const docRef = doc(this.firestore, 'channels', channelID);
      updateDoc(docRef, {members: arrayUnion(user)})
   }
}
