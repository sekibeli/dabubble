import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { DocumentSnapshot, Firestore, addDoc, arrayUnion, collection, collectionData, doc, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Subject, first } from 'rxjs';
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
   displayedChannel: BehaviorSubject<any> = new BehaviorSubject<any>(null); //BehaviorSubject mit dem aktuellen Channel
   channelUserIDArray;
   membersUserIDArray: any[];
      currentChannelTitle;
   currentChannelUserArray = [];


 currentChannelUserArraySubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  
   constructor(private userService: UserService, public dialog: MatDialog) {
     }

   getChannels() {
      const collRef = collection(this.firestore, 'channels');
      const docChannel = collectionData(collRef, { idField: 'id' });
      return docChannel;
   }

   ngOnInit() {
   }

   getChannelsWhereCurrentUserIsMember(userId: string) {
           const collRef = collection(this.firestore, 'channels');
            const collRefQuery = query(collRef, where('members', 'array-contains', userId));
      const docRef = collectionData(collRefQuery); 
      return docRef;
   }



   pushActiveChannel(channel:any) {
      this.currentChannelID.next(channel.id);
      this.channel = channel;
      this.currentChannelTitle = channel['title'];
           this.displayedChannel.next(channel); 

      this.getMembersOfChannelNEW(channel['id']).then(members => { // hole Member of channel
         this.membersUserIDArray = members; // übergebe das array mit strings
                  this.getMembersData(this.membersUserIDArray); // hole mit stringarray die members daten
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
               this.currentChannelUserArray = usersArray;
               this.currentChannelUserArraySubject.next(usersArray);
                  }
         });
      });
   }


   async getMembersOfChannelNEW(channel: string): Promise<any[]> {

      const docRef = doc(this.firestore, 'channels', channel);
      const channelDoc = await getDoc(docRef);

      if (channelDoc.exists()) {
         const channelData = channelDoc.data();
         const channelMember = channelData['members'];
               this.getMembersData(channelMember);
        
         return channelMember;
      } else {
         console.log('dokument existiert nicht');
         return [];
      }

   }
   getCurrentChannel(channelID) {
      const docData = doc(this.firestore, 'channels', channelID)
      return docData;
   }


   async getChannelData(channelID: string) {
      const docRef = doc(this.firestore, 'channels', channelID)
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
              return null;
      }
      const data = docSnap.data();
      return { id: docSnap.id, ...data };
   }
   
   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }

   saveChannel(channel) {
      const collRef = collection(this.firestore, 'channels');
      
      addDoc(collRef, channel.toJSON()).then(docRef => {
         // docRef enthält die Referenz auf das neu erstellte Firestore-Dokument
         const channelID = docRef.id;
     
         // Aktualisieren Sie das Channel-Objekt mit der Firestore-zugewiesenen ID
         channel.id = channelID;
         const docRefWithID = doc(this.firestore, 'channels', channelID);
         setDoc(docRefWithID, channel.toJSON());
                         });



   }

   addMemberToChannel(channelID, user) {
     
      this.checkIfUserIsAlreadyMemberOfChannel(channelID, user).then(result => {
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
     
      const dialogConfig = new MatDialogConfig();
      dialogConfig.position = {
         top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
         right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
      };
      
      const dialogRef = this.dialog.open(DialogAddMemberComponent, dialogConfig);
      
   }


   async checkIfUserIsAlreadyMemberOfChannel(channelID, user): Promise<boolean> {
      let check: boolean;

      const value = await this.getMembersOfChannelNEW(channelID);
     
      if (value) {
         check = value.includes(user);
      } else {
         check = false;
      }

           return check;
   }


   async updateChannel(id, title, description) {
     
      try {
         const docRef = doc(this.firestore, 'channels', id);

         await updateDoc(docRef,
            {
               title: title,
               description: description
            });
      } catch (error) {
         console.log('Fehler: ', error);
      }
   }

   async deleteMemberFromChannel(channelID, userId){
        
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
