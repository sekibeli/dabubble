import { Component, OnInit, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { Channel } from '../models/channel.class';
import { ChannelService } from '../services/channel.service';
import { DialogAddMemberToNewChannelComponent } from '../dialog-add-member-to-new-channel/dialog-add-member-to-new-channel.component';

@Component({
  selector: 'app-dialog-new-channel',
  templateUrl: './dialog-new-channel.component.html',
  styleUrls: ['./dialog-new-channel.component.scss']
})
export class DialogNewChannelComponent  {
  firestore: Firestore = inject(Firestore);
  createdBy;
  isUsed: boolean;
  newChannelForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<DialogNewChannelComponent>, private channelService: ChannelService, private dialog: MatDialog){
   
  }

  checkChannelTitles(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const allChannels = this.channelService.getAllChannels();
      allChannels.then((value)=> {
        value.subscribe(channels => {
          let titleArray = [];
          channels.forEach(channel => {
            titleArray.push(channel['title']);
          });
          // Überprüfen, ob der Titel bereits existiert
          const isUsed = titleArray.includes(this.newChannelForm.value.title);
          resolve(isUsed);
        });
      });
    });
  }

  async addNewChannel(){
        const isTitleUsed = await this.checkChannelTitles();
    
        if(isTitleUsed){
          this.newChannelForm.controls['title'].setErrors({ 'titleTaken': true });
        } else { 
          let membersArray = [];
          // membersArray.push(localStorage.getItem('currentUserID'));
      
          const test = this.newChannelForm.value.title;
            let channel = new Channel({
             id: '',
            title: this.newChannelForm.value.title,
            description: this.newChannelForm.value.description,
            createdBy: localStorage.getItem('currentUserID'),
            members: membersArray
          });
      
          this.channelService.saveChannel(channel);
          this.openDialogAddMemberToNewChannel(channel)
          this.dialogRef.close();
        } 
     

  }

  openDialogAddMemberToNewChannel(channel) {
 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '200px',  // Ändere diese Werte entsprechend deiner gewünschten Position
      // right: '10%'   // Ändere diese Werte entsprechend deiner gewünschten Position
    };
    dialogConfig.data = { 
      // channelTitle: activeChannelTitle,
    channel: channel };
    const dialogRef = this.dialog.open(DialogAddMemberToNewChannelComponent, dialogConfig);
    dialogRef.componentInstance.channel = channel;
  }

}
