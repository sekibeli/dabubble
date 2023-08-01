import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
firestore: Firestore = inject(Firestore)
  constructor() { }

  async getChannels(){
    const collRef = collection(this.firestore, 'channels');
    const docChannel = await collectionData(collRef, {idField: 'id'});
    return docChannel;
   }
}
