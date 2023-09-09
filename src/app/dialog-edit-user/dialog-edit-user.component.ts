import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';


@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent implements OnInit {
user: User;
originalUser: User;

constructor(public dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public userService: UserService, private cd: ChangeDetectorRef){
  this.originalUser = JSON.parse(JSON.stringify(this.data.user));
 }

ngOnInit(): void {
 }


cancel(){
  Object.assign(this.data.user, this.originalUser);
   this.dialogRef.close();
  }


updateUsername(){
  this.userService.setUserName(this.data.user['id'], this.data.user['username']);
  this.dialogRef.close();
}
}
