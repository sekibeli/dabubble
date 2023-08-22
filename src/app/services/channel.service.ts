import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, arrayUnion, collection, collectionData, doc, docData, getDoc, or, query, updateDoc, where } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Subject, first, forkJoin, merge, mergeAll, takeUntil } from 'rxjs';
import { User } from '../models/user.class';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';

@Injectable({
   providedIn: 'root'
})
export class ChannelService implements OnInit, OnDestroy {
   check;
   currentChannelID = 'OnQ02XRJqwZRA0ts0qc5';
   private destroy$: Subject<void> = new Subject<void>();
   firestore: Firestore = inject(Firestore)
   channelUser: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
   channelUserIDArray;
   membersUserIDArray: any[];
   channelUserArrayEmitter = new EventEmitter<any>();
   currentChannelTitle;
   currentChannelUserArray = [];

  private currentChannelUserArraySubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
   currentChannelUserArray$ = this.currentChannelUserArraySubject.asObservable();
    
   activeChannelTitle = new EventEmitter<string>();
   activeChannelID = new EventEmitter<string>();
activeChannel = new EventEmitter<any>();
   constructor(private userService: UserService, public dialog: MatDialog) {
console.log('obsi:', this.currentChannelUserArray$);
      // this.getInitials('9Gwz1Ce763caWx5FCBZL');
   }

   getChannels() {
      const collRef = collection(this.firestore, 'channels');
      const docChannel = collectionData(collRef, { idField: 'id' });
      return docChannel;
   }

   ngOnInit() {

   }

   getChannelsWhereCurrentUserIsMember(userId){
      // const userId = 'xeLjLZJ7SYVREnmskY07GgKMwnx1';
      // const collRef = query(collection(this.firestore, 'channels'), where('members', 'array-contains', userId), where('createdBy', '==', userId));
      // const docRef = collectionData(collRef, { idField: 'id' });
      const collRef = collection(this.firestore, 'channels');
      const collRefQuery = query (collRef, or( where('members', 'array-contains', userId), where('createdBy', '==', userId) ))
      const docRef = collectionData(collRefQuery, { idField: 'id' });
      return docRef;
    }
   


   pushActiveChannel(channel) {
      // this.activeChannelTitle.emit(title);
      this.currentChannelTitle = channel['title'];
      this.currentChannelID = channel['id'];
      this.activeChannel.emit(channel);
      // console.log( 'Holmes1', this.currentChannelTitle);
      // console.log( 'Holmes2', this.currentChannelID);
    
      this.getMembersOfChannelNEW(channel['id']).then(members => {
         this.membersUserIDArray = members;
         // console.log('Inhalt membersUserIDArray', this.membersUserIDArray);
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
               // this.currentChannelUserArray = [];
               // this.currentChannelUserArray = usersArray;
               this.currentChannelUserArray = usersArray;
               this.currentChannelUserArraySubject.next(usersArray);
               // console.log('Array nach getMembersData:', this.currentChannelUserArray);
               // this.channelUserArrayEmitter.emit(this.currentChannelUserArray);
            }
         });
      });
   }


   getMembersOfChannel(channel:string) {
      const collRef = collection(this.firestore, 'channels', channel);
      const docRef = collectionData(collRef);
      return docRef;
   }

   async getMembersOfChannelNEW(channel: string): Promise<any[]> {
   
      const docRef = doc(this.firestore, 'channels', channel);
      const channelDoc = await getDoc(docRef);

      if (channelDoc.exists()) {
         const channelData = channelDoc.data();
         const channelMember = channelData['members'];
         console.log('aktulle Mitglieder:', channelMember);
         this.currentChannelUserArraySubject.next(channelMember);
         return channelMember;
      } else {
         console.error('dokument existiert nicht');
         return [];
      }

   }
getCurrentChannel(channelID){
   const docData = doc(this.firestore, 'channels', channelID)
     return docData;
}


async getChannelData(channelID:string){

   const docRef = doc(this.firestore, 'channels', channelID)
   const docSnap = await getDoc(docRef);

   if(!docSnap.exists()){
      console.log('Der Channel existiert nicht!');
      return null;
   }
   const data = docSnap.data();
    return {id: docSnap.id, ...data};
}
   // getInitials(id) {
   //    const data = this.getMembersOfChannel(id);
   //    data.subscribe((user) => {
   //       console.log('test', user);
   //       this.channelUserIDArray = user;
   //       console.log(this.channelUserIDArray);
   //    })
   // }

   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }

   saveChannel(channel) {
      const collRef = collection(this.firestore, 'channels');
      addDoc(collRef, channel.toJSON());
   }

   addMemberToChannel(channelID, user) {
     this.checkIfUserIsAlreadyMemberOfChannel(channelID, user).then(result => {
      console.log('Ergebnis:', result);
      this.check = result;
     })
      if (!this.check) {
         const docRef = doc(this.firestore, 'channels', channelID);
         updateDoc(docRef, { members: arrayUnion(user) })
      } else {
         console.log('User ist schon Mitglied!');
      }
   }

   openAddMemberDialog(activeChannelTitle: string) {
      console.log('openDialog');
      const dialogConfig = new MatDialogConfig();
      dialogConfig.position = {
         top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
         right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
      };
      dialogConfig.data = { channelTitle: activeChannelTitle };
      const dialogRef = this.dialog.open(DialogAddMemberComponent, dialogConfig);
      dialogRef.componentInstance.channelTitle = this.activeChannelTitle;
   }


   async checkIfUserIsAlreadyMemberOfChannel(channelID, user): Promise<boolean> {
   let check: boolean;
      
      const value = await this.getMembersOfChannelNEW(channelID);
      
         console.log('member:', value);
         
         if (value) {
            check = value.includes(user);
         } else {
            check = false;
         }
      
      console.log('check:', check);
      return check;
   }


   async updateChannel(id, title, description) {
      console.log('id:', id);
      try {
        const docRef = doc(this.firestore, 'channels', id);
  
        await updateDoc(docRef,
          {
            title: title,
            description: description
          });
      } catch (error) {
        console.error('Fehler: ', error);
      }
    }
   

}
