import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, arrayRemove, arrayUnion, collection, collectionData, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, first } from 'rxjs';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class SmilyService {
  firestore: Firestore = inject(Firestore);
  // userArraySubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  userNames: string[] = [];
  showPicker:boolean = false;
  constructor(private userService:UserService) { }

  async saveReaction(event, channelID: string, postID: string, userID: string) {

    const reaction = event.emoji.native;
    const reactionRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'reactions', reaction);
    const reactionDoc = await getDoc(reactionRef);

    if (reactionDoc.exists()) {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
        user: arrayUnion(userID),
        names: arrayUnion(user['username'])
      }, { merge: true });
    } else {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
        emoji: reaction,
        user: arrayUnion(userID),
        names: arrayUnion(user['username'])
      });
    }



  }


  async saveReactionMessage(event, messageID: string, userID: string) {

    const reaction = event.emoji.native;
    const reactionRef = doc(this.firestore, 'messages', messageID, 'reactions', reaction);
    const reactionDoc = await getDoc(reactionRef);

    if (reactionDoc.exists()) {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
        user: arrayUnion(userID),
        names: arrayUnion(user['username'])
      }, { merge: true });
    } else {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
        emoji: reaction,
        user: arrayUnion(userID),
        names: arrayUnion(user['username'])
      });
    }



  }

  async saveReactionThread(event, channelID: string, postID: string, threadID:string, userID: string) {

    const reaction = event.emoji.native;
    const reactionRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'threads', threadID, 'reactions', reaction);
    const reactionDoc = await getDoc(reactionRef);

    if (reactionDoc.exists()) {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
        user: arrayUnion(userID),
        names: arrayUnion(user['username'])
      }, { merge: true });
    } else {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
        emoji: reaction,
        user: arrayUnion(userID),
        names: arrayUnion(user['username'])
      });
    }



  }

//   async addOrDeleteReaction(emoji, channelID: string, postID: string, userID: string) {
// console.log(emoji, channelID, postID, userID);
//     const reaction = emoji;
//     const reactionRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'reactions', reaction);
//     const reactionDoc = await getDoc(reactionRef);

//     if (reactionDoc.exists()) {
//       // Hole das bestehende 'user'-Array aus dem Dokument
//       const existingUsers = reactionDoc.data().user || [];
//       const existingNames = reactionDoc.data().names || [];
    
//       // Überprüfe, ob die userID bereits im Array existiert
//       if (existingUsers.includes(userID)) {
//         // Entferne die userID aus dem Array
//         await updateDoc(reactionRef, {
//           user: arrayRemove(userID)
//         });
//       } else {
//         // Füge die userID zum Array hinzu
//         await updateDoc(reactionRef, {
//           user: arrayUnion(userID)
//         });
//         this.getUserIDsAndSaveNames(emoji, channelID,postID,userID);
//       }
//     } else {
//       await setDoc(reactionRef, {
//         emoji: reaction,
//         user: arrayUnion(userID)
//       });
//     }
  
    

//   }

async addOrDeleteReaction(emoji, channelID: string, postID: string, userID: string) {
  const reaction = emoji;
  const reactionRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'reactions', reaction);
  const reactionDoc = await getDoc(reactionRef);

  if (reactionDoc.exists()) {
      const existingUsers = reactionDoc.data().user || [];
      const existingNames = reactionDoc.data().names || [];
      
      // Finde den Index der userID im existingUsers Array
      const index = existingUsers.indexOf(userID);

      if (index !== -1) {
          // Entferne die userID und den zugehörigen Benutzernamen aus den Arrays
          existingUsers.splice(index, 1);
          existingNames.splice(index, 1);
      } else {
          // Füge die userID und den zugehörigen Benutzernamen zu den Arrays hinzu
          const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
          existingUsers.push(userID);
          existingNames.push(user['username']);
      }

      // Aktualisiere die Firestore-Dokumente
      await updateDoc(reactionRef, {
          user: existingUsers,
          names: existingNames
      });
  } else {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
          emoji: reaction,
          user: [userID],
          names: [user['username']]
      });
  }
}


async addOrDeleteReactionMessage(emoji, messageID: string, userID: string) {
  console.log(messageID);
  console.log(userID);
  const reaction = emoji;
  const reactionRef = doc(this.firestore, 'messages', messageID, 'reactions', reaction);
  const reactionDoc = await getDoc(reactionRef);

  if (reactionDoc.exists()) {
      const existingUsers = reactionDoc.data().user || [];
      const existingNames = reactionDoc.data().names || [];
      
      // Finde den Index der userID im existingUsers Array
      const index = existingUsers.indexOf(userID);

      if (index !== -1) {
          // Entferne die userID und den zugehörigen Benutzernamen aus den Arrays
          existingUsers.splice(index, 1);
          existingNames.splice(index, 1);
      } else {
          // Füge die userID und den zugehörigen Benutzernamen zu den Arrays hinzu
          const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
          existingUsers.push(userID);
          existingNames.push(user['username']);
      }

      // Aktualisiere die Firestore-Dokumente
      await updateDoc(reactionRef, {
          user: existingUsers,
          names: existingNames
      });
  } else {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
          emoji: reaction,
          user: [userID],
          names: [user['username']]
      });
  }
}

async addOrDeleteReactionThread(emoji, channelID: string, postID: string, threadID: string, userID: string) {
  console.log(channelID);
  console.log(postID);
  console.log(threadID);
  console.log(emoji);
  console.log(userID);
  channelID = localStorage.getItem('currentChannelID');
  const reaction = emoji;
  const reactionRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'threads', threadID, 'reactions', reaction);
  const reactionDoc = await getDoc(reactionRef);

  if (reactionDoc.exists()) {
      const existingUsers = reactionDoc.data().user || [];
      const existingNames = reactionDoc.data().names || [];
      console.log(existingNames);
      // Finde den Index der userID im existingUsers Array
      const index = existingUsers.indexOf(userID);

      if (index !== -1) {
          // Entferne die userID und den zugehörigen Benutzernamen aus den Arrays
          existingUsers.splice(index, 1);
          existingNames.splice(index, 1);
      } else {
          // Füge die userID und den zugehörigen Benutzernamen zu den Arrays hinzu
          const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
          existingUsers.push(userID);
          existingNames.push(user['username']);
      }

      // Aktualisiere die Firestore-Dokumente
      await updateDoc(reactionRef, {
          user: existingUsers,
          names: existingNames
      });
  } else {
      const user = await this.userService.getCurrentUser(userID).pipe(first()).toPromise();
      await setDoc(reactionRef, {
          emoji: reaction,
          user: [userID],
          names: [user['username']]
      });
  }
}

  async getUserIDsAndSaveNames(emoji, channelID: string, postID: string, userID: string) {
    console.log(emoji, channelID, postID, userID);
        const reaction = emoji;
        const reactionRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'reactions', reaction);
        const reactionDoc = await getDoc(reactionRef);
    
        if (reactionDoc.exists()) {
          // Hole das bestehende 'user'-Array aus dem Dokument
          const existingUsers = reactionDoc.data().user || [];
     
          console.log(existingUsers);
         const namesArray =  await this.getMembersData(existingUsers)
         await updateDoc(reactionRef, {
        
          names: namesArray
        });

        }
      }

  async getMembersData(userArrayIDs) {

    const usersArray = [];
  const userNames = [];

  const promises = userArrayIDs.map(element => 
    this.userService.getCurrentUser(element).pipe(first()).toPromise()
  );

  const users = await Promise.all(promises);

  for (const user of users) {
    usersArray.push(user as User);
    userNames.push(user['username']);
  }

  return userNames;


 }

  async getAllReactions(channelID: string, postID: string) {
    const collRef = collection(this.firestore, 'channels', channelID, 'posts', postID, 'reactions');
    const docRef = await collectionData(collRef);
    return docRef;
  }

  async getAllReactionsMessage(messageId: string) {
    const collRef = collection(this.firestore, 'messages', messageId, 'reactions');
    const docRef = await collectionData(collRef);
    return docRef;
  }

  async getAllReactionsThread(channelID: string, postID: string, threadID: string) {
    console.log(channelID);
    console.log(postID);
    console.log(threadID);
    try {

    const collRef = collection(this.firestore, 'channels', channelID, 'posts', postID, 'threads', threadID, 'reactions' );
    
      const docRef = await collectionData(collRef);
    return docRef;
    } catch(error){
      console.log("Ist noch nicht da: ");
      return null;
    }
    
  }

  addReaction(event, channel, post, thread) {
    // const smily = `${event.emoji.native}`;
    console.log(event);
    console.log(channel['id']);
    console.log(post['id']);
    console.log(localStorage.getItem("currentUserID"));
    this.saveReaction(event, channel['id'], post['id'], localStorage.getItem('currentUserID'));
    this.showPicker = false;

  }
}