import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, arrayUnion, collection, collectionData, doc, docData, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Subject, first, forkJoin, merge, mergeAll, takeUntil } from 'rxjs';
import { User } from '../models/user.class';

@Injectable({
   providedIn: 'root'
})
export class ChannelService implements OnInit, OnDestroy {
   private destroy$: Subject<void> = new Subject<void>();
   firestore: Firestore = inject(Firestore)
   channelUser: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
   channelUserIDArray;
   membersUserIDArray: any[];
   channelUserArrayEmitter = new EventEmitter<any>();
   
   currentChannelUserArray
   = [{

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

      this.getMembersOfChannelNEW(id).then(members => {
         this.membersUserIDArray = members;
         console.log('Inhalt membersUserIDArray', this.membersUserIDArray); // Hier stimmts noch
         this.getMembersData(this.membersUserIDArray);
       });
        }
  

  getMembersData(userArrayIDs) {
      
      this.currentChannelUserArray = [];
      let fetchCount = userArrayIDs.length;
      let usersArray = [];
    
     userArrayIDs.forEach(element => {
         this.userService.getCurrentUser(element).pipe(first()).subscribe((user) => {
            usersArray.push(user);
        
            fetchCount--;
            if (fetchCount === 0) {
               this.currentChannelUserArray = [];
               this.currentChannelUserArray = usersArray;
               console.log('Array nach getMembersData:', this.currentChannelUserArray);
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

   async getMembersOfChannelNEW(channel: string): Promise<any[]>{
      const docRef = doc(this.firestore, 'channels', channel);
      const channelDoc = await getDoc(docRef);

      if(channelDoc.exists()){
         const channelData = channelDoc.data();
         const channelMember = channelData?.members || [];
         return channelMember;
      } else {
         console.error('dokument existiert nicht');
         return [];
      }
     
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
