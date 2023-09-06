import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { DocumentSnapshot, Firestore, addDoc, arrayUnion, collection, collectionData, doc, docData, getDoc, onSnapshot, or, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Subject, first, forkJoin, merge, mergeAll, takeUntil } from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';


@Injectable({
   providedIn: 'root'
})
export class ChannelService implements OnInit, OnDestroy {
   check;
   channel;
   currentChannelID: BehaviorSubject<string> = new BehaviorSubject<string>('OnQ02XRJqwZRA0ts0qc5');
   private destroy$: Subject<void> = new Subject<void>();
   firestore: Firestore = inject(Firestore)
   channelUser: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
   serviceChannel: BehaviorSubject<any> = new BehaviorSubject<any>(null); //BehaviorSubject mit dem aktuellen Channel
   channelUserIDArray;
   membersUserIDArray: any[];
   // channelUserArrayEmitter = new EventEmitter<any>();
   currentChannelTitle;
   currentChannelUserArray = [];


 currentChannelUserArraySubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
   currentChannelUserArray$ = this.currentChannelUserArraySubject.asObservable();


   activeChannelTitle = new EventEmitter<string>();
   activeChannelID = new EventEmitter<string>();
   activeChannel = new EventEmitter<any>();
   serviceChannelEmitter = new EventEmitter<any>();
   constructor(private userService: UserService, public dialog: MatDialog) {
    
      // console.log('obsi:', this.currentChannelUserArray$);
      // this.getInitials('9Gwz1Ce763caWx5FCBZL');
   }

   getChannels() {
      const collRef = collection(this.firestore, 'channels');
      const docChannel = collectionData(collRef, { idField: 'id' });
      return docChannel;
   }

   ngOnInit() {

   }

   getChannelsWhereCurrentUserIsMember(userId: string) {
      // const userId = 'xeLjLZJ7SYVREnmskY07GgKMwnx1';
      // const collRef = query(collection(this.firestore, 'channels'), where('members', 'array-contains', userId), where('createdBy', '==', userId));
      // const docRef = collectionData(collRef, { idField: 'id' });
      const collRef = collection(this.firestore, 'channels');
      // const collRefQuery = query(collRef, or(where('members', 'array-contains', userId), where('createdBy', '==', userId)))
      const collRefQuery = query(collRef, where('members', 'array-contains', userId));
      const docRef = collectionData(collRefQuery); // hinter collRefQuery war , { idField: 'id' }
      return docRef;
   }



   pushActiveChannel(channel:any) {
      this.currentChannelID.next(channel.id);
      this.channel = channel;
           this.currentChannelTitle = channel['title'];
         this.activeChannel.emit(channel);
         // this.serviceChannelEmitter.emit(this.serviceChannel)
    this.serviceChannel.next(channel);
console.log('Daten von folgendem Channel:', channel['title']);
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
               // this.channelUserArrayEmitter.emit(this.currentChannelUserArray$);
               console.log('this.currentChannelUserArraySubject', this.currentChannelUserArraySubject);
            }
         });
      });
   }


   // getMembersOfChannel(channel: string) {
   //    const collRef = collection(this.firestore, 'channels', channel);
   //    const docRef = collectionData(collRef);
   //    return docRef;
   // }

   async getMembersOfChannelNEW(channel: string): Promise<any[]> {

      const docRef = doc(this.firestore, 'channels', channel);
      const channelDoc = await getDoc(docRef);

      if (channelDoc.exists()) {
         const channelData = channelDoc.data();
         const channelMember = channelData['members'];
         console.log('Mitglieder IDs des Channels:', channelMember);
         this.getMembersData(channelMember);
         // this.currentChannelUserArraySubject.next(channelMember);  <-----
         return channelMember;
      } else {
         console.error('dokument existiert nicht');
         return [];
      }

   }
   getCurrentChannel(channelID) {
      const docData = doc(this.firestore, 'channels', channelID)
      return docData;
   }


   async getChannelData(channelID: string) {
console.log('existiert der Channel?:', channelID);
      const docRef = doc(this.firestore, 'channels', channelID)
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
         console.log('Der Channel existiert nicht!');
         return null;
      }
      const data = docSnap.data();
      return { id: docSnap.id, ...data };
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
      // addDoc(collRef, channel.toJSON());
      addDoc(collRef, channel.toJSON()).then(docRef => {
         // docRef enthält die Referenz auf das neu erstellte Firestore-Dokument
         const channelID = docRef.id;
     
         // Aktualisieren Sie das Channel-Objekt mit der Firestore-zugewiesenen ID
         channel.id = channelID;
         const docRefWithID = doc(this.firestore, 'channels', channelID);
         setDoc(docRefWithID, channel.toJSON());
         // Sie können hier weitere Aktionen ausführen oder das aktualisierte Objekt zurückgeben
         console.log('Neuer Kanal wurde erstellt:', channel);
       });



   }

   addMemberToChannel(channelID, user) {
      console.log(channelID);
      console.log(user);
      this.checkIfUserIsAlreadyMemberOfChannel(channelID, user).then(result => {
         console.log('Ergebnis:', result);
         this.check = result;
      })
      if (!this.check) {
         console.log('User wird hinzugefügt');
         const docRef = doc(this.firestore, 'channels', channelID);
         updateDoc(docRef, {
            members: arrayUnion(user)
         })
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

      // console.log('member:', value);

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

   async deleteMemberFromChannel(channelID, userId){
      console.log(channelID);
      console.log(userId);

   
      const  docRef = doc(this.firestore, 'channels', channelID);
     
      try {
         const docSnap: DocumentSnapshot = await getDoc(docRef);
         if (docSnap.exists()) {
            
           const membersArray: string[] = docSnap.data()?.members || [];
   
           // Remove the user from the members array
           const updatedMembersArray: string[] = membersArray.filter(member => member !== userId);
   
           // Update the document with the modified members array
           await updateDoc(docRef, { members: updatedMembersArray });
         } else {
           console.log('Document not found');
         }
       } catch (error) {
         console.error('Error deleting member:', error);
       }


     }

     async getMembersOfChannelAndPushInNewChannel(newChannelID: string){
      const docRef = doc(this.firestore, 'channels', 'BwYu94QGYDi8hQta31RP');
      try {
         const docSnap: DocumentSnapshot = await getDoc(docRef);
         if (docSnap.exists()) {
             const membersArray: string[] = docSnap.data()?.members || [];
this.pushMembersArrayInChannel(membersArray, newChannelID );

        } else {}
      } catch (error) {
         console.error(error);
      }
   

   }

   async pushMembersArrayInChannel(array: string[], channelID: string){
    try{
      const docRef = doc(this.firestore, 'channels', channelID);
      await updateDoc(docRef, {members: array})
    } catch ( error){
      console.error('array konnte nicht hinzugefügt werden', error);
    }
   } 

  async getAllChannels(){
      const collRef = collection(this.firestore, 'channels');
      const docRef = await collectionData(collRef);
      return docRef;
   }


   checkChannelTitles(title: string): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        const allChannels = this.getAllChannels();
        allChannels.then((value)=> {
          value.subscribe(channels => {
            let titleArray = [];
            channels.forEach(channel => {
              titleArray.push(channel['title']);
            });
            // Überprüfen, ob der Titel bereits existiert
            const isUsed = titleArray.includes(title);
            resolve(isUsed);
          });
        });
      });
    }
   
}
