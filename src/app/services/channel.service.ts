import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, arrayUnion, collection, collectionData, doc, docData, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
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

   constructor(private userService: UserService, public dialog: MatDialog) {

      // this.getInitials('9Gwz1Ce763caWx5FCBZL');
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
      this.currentChannelTitle = title;
      this.currentChannelID = id;
      // console.log( 'Holmes1', this.currentChannelTitle);
      // console.log( 'Holmes2', this.currentChannelID);
      this.getMembersOfChannelNEW(id).then(members => {
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
               this.currentChannelUserArray = [];
               this.currentChannelUserArray = usersArray;
               // console.log('Array nach getMembersData:', this.currentChannelUserArray);
               this.channelUserArrayEmitter.emit(this.currentChannelUserArray);
            }
         });
      });
   }


   getMembersOfChannel(channel) {
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
         return channelMember;
      } else {
         console.error('dokument existiert nicht');
         return [];
      }

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
     
      if (this.checkIfUserIsAlreadyMemberOfChannel(channelID, user)) {
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


   checkIfUserIsAlreadyMemberOfChannel(channelID, user): boolean {
    
      
      this.getMembersOfChannelNEW(channelID).then(value => {
        
         console.log('member:', value);
         if(value){
         if (value.includes(user)) {
            this.check = true;
         } else {
            this.check = false;
         }
      }
      })
      console.log('check:', this.check);
      return this.check;
   }

}
