import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChannelService implements OnInit {
firestore: Firestore = inject(Firestore)
channelID: string;
channels;
  constructor() {
   
   }

  async getChannels(){
    const collRef = collection(this.firestore, 'channels');
    const docChannel = await collectionData(collRef, {idField: 'id'});
    return docChannel;
   }

   ngOnInit(){
console.log(this.channels);
   }
   currentChannel(id){
this.channelID = id;
   }
}
