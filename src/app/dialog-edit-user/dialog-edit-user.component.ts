import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent implements OnInit {
user: any;
originalUser: any;

constructor(public dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public userService: UserService){
  this.originalUser = JSON.parse(JSON.stringify(this.data.user));
  console.log(data);
  console.log('orginal:', this.originalUser);
 
}

ngOnInit(): void {
 
}
cancel(){
  console.log('orginal:', this.originalUser);
  this.data.user = JSON.parse(JSON.stringify(this.originalUser));
  this.dialogRef.close();
  
}
updateUsername(){
  console.log('orginal:', this.originalUser);
  console.log(this.data.user['id'], this.data.user['username']);
  this.userService.setUserName(this.data.user['id'], this.data.user['username']);
  this.dialogRef.close();
}
}
