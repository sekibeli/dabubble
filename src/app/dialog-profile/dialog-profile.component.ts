import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { DrawerService } from '../services/drawer.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dialog-profile',
  templateUrl: './dialog-profile.component.html',
  styleUrls: ['./dialog-profile.component.scss']
})
export class DialogProfileComponent {
  me: boolean =true;
  user;


  constructor(public dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any, public messageService: MessageService, public drawerService:DrawerService){
    console.log('Data:',data);
    localStorage.setItem('directMessage', 'true');
    localStorage.setItem('channelMessage', 'false');
    localStorage.setItem('threadMessage','false');
 
    this.checkIfItIsMe(data);
 
  }

  checkIfItIsMe(user){
    let _user: string;
  if(user.user instanceof BehaviorSubject){
    _user = user.user.getValue();
    console.log('BH:' , _user['id'],  'und', localStorage.getItem('currentUserID'));
  }
  else {
    console.log('String', user['user'], 'und', localStorage.getItem('currentUserID'));
    _user = user['user'];

  }
  this.me = (_user === localStorage.getItem('currentUserID'));
}
}
