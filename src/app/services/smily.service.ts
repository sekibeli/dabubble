import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, arrayUnion, collection, collectionData, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SmilyService {
firestore: Firestore = inject(Firestore);
  constructor() { }

  async saveReaction(event, channelID:string, postID:string, userID:string){

    const reaction = event.emoji.native;
    const reactionRef = doc(this.firestore, 'channels', channelID, 'posts', postID, 'reactions', reaction);
    const reactionDoc = await getDoc(reactionRef);

if(reactionDoc.exists()){
  await setDoc(reactionRef, {
    user: arrayUnion(userID)
  }, {merge: true});
} else {
  await setDoc(reactionRef, {
    emoji: reaction,
    user: arrayUnion(userID)
  });
}



}

async getAllReactions(channelID:string, postID:string){
  const collRef = collection(this.firestore,'channels', channelID, 'posts', postID, 'reactions');
   const docRef = await collectionData(collRef);
   return docRef;
}
}