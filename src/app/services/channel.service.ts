import { EventEmitter, Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChannelService implements OnInit {
firestore: Firestore = inject(Firestore)
// channelID: string ;

// channels;
activeChannel = new EventEmitter<string>();

  constructor() {
   
   }

  async getChannels(){
    const collRef = collection(this.firestore, 'channels');
    const docChannel = await collectionData(collRef, {idField: 'id'});
    return docChannel;
   }

   ngOnInit(){

   }
   pushActiveChannel(title){
    
      this.activeChannel.emit(title);

   }

}
