import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { DrawerService } from '../services/drawer.service';
import { BehaviorSubject } from 'rxjs';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-dialog-profile',
  templateUrl: './dialog-profile.component.html',
  styleUrls: ['./dialog-profile.component.scss']
})
export class DialogProfileComponent {
  me: boolean =true;
  user;


  constructor(public dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any, public messageService: MessageService, public drawerService:DrawerService, public dialog: MatDialog){
  
    localStorage.setItem('directMessage', 'true');
    localStorage.setItem('channelMessage', 'false');
    localStorage.setItem('threadMessage','false');
 this.user = data;
    this.checkIfItIsMe(data);
   
 
  }

  checkIfItIsMe(user){
  
    let _user: string;
  if(user.user instanceof BehaviorSubject){
    _user = user.user.getValue();
    // console.log('BH:' , _user['id'],  'und', localStorage.getItem('currentUserID'));
    this.me = (_user['id'] == localStorage.getItem('currentUserID'));
  }
  else {
    // console.log('String', user.user['id'], 'und', localStorage.getItem('currentUserID'));
    _user = user.user['id'];
    this.me = (_user == localStorage.getItem('currentUserID'));

  }
 

}

openEditUser(user){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = { user: user };
  const dialogRef = this.dialog.open(DialogEditUserComponent, dialogConfig);
  dialogRef.componentInstance.user = this.user.value;
}
}
