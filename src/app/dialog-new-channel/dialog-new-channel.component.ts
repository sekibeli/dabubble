import { Component, OnInit, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef} from '@angular/material/dialog';
import { Channel } from '../models/channel.class';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-dialog-new-channel',
  templateUrl: './dialog-new-channel.component.html',
  styleUrls: ['./dialog-new-channel.component.scss']
})
export class DialogNewChannelComponent  {
  firestore: Firestore = inject(Firestore);
  createdBy;
  
  newChannelForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<DialogNewChannelComponent>, private channelService: ChannelService){
   
  }


  addNewChannel(){
    let membersArray = [];
    membersArray.push(localStorage.getItem('currentUserID'));

    const test = this.newChannelForm.value.title;
      let channel = new Channel({
      title: this.newChannelForm.value.title,
      description: this.newChannelForm.value.description,
      createdBy: localStorage.getItem('currentUserID'),
      members: membersArray
    });

    this.channelService.saveChannel(channel);
    this.dialogRef.close();
  }

}
