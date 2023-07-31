import { Component, inject } from '@angular/core';
import { PostService } from '../services/post.service';
import { DrawerService } from '../services/drawer.service';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-left-drawer',
  templateUrl: './left-drawer.component.html',
  styleUrls: ['./left-drawer.component.scss']
})
export class LeftDrawerComponent {
  channels;
  firestore: Firestore = inject(Firestore);
constructor(public postService: PostService, public drawerService: DrawerService){
this.getChannels().then((items)=> {
  items.subscribe((value)=>{
    this.channels = value;
    });
 
})
}
posts;

 async getChannels(){
  const collRef = collection(this.firestore, 'channels');
  const docChannel = await collectionData(collRef, {idField: 'id'});
  return docChannel;
 }


}
