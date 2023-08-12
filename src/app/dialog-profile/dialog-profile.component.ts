import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-dialog-profile',
  templateUrl: './dialog-profile.component.html',
  styleUrls: ['./dialog-profile.component.scss']
})
export class DialogProfileComponent {
  user;


  constructor(public dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any, public messageService: MessageService, public drawerService:DrawerService){
    console.log(data);
    localStorage.setItem('directMessage', 'true');
    localStorage.setItem('channelMessage', 'false');
    localStorage.setItem('threadMessage','false');
 
 
  }

  chatWith(){}
}
