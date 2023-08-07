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

getChannels(){
    const collRef = collection(this.firestore, 'channels');
    const docChannel = collectionData(collRef, {idField: 'id'});
    return docChannel;
   }

   ngOnInit(){

   }
   pushActiveChannel(title){
    
      this.activeChannel.emit(title);

   }

}
