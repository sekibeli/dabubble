import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { User } from '../models/user.class';

@Component({
  selector: 'app-dialog-logout',
  templateUrl: './dialog-logout.component.html',
  styleUrls: ['./dialog-logout.component.scss']
})
export class DialogLogoutComponent {
  currentUser;
user: any;

  constructor(private afAuth: AngularFireAuth, private userService: UserService, public dialogRef: MatDialogRef<DialogProfileComponent>, public dialog: MatDialog){
    this.currentUser = localStorage.getItem('currentUserID');

    this.userService.getCurrentUser(this.currentUser).subscribe((value)=>{
     this.user = value;
   
    });
  
  }
  
  logUserOut(){
    this.afAuth.signOut().then(()=>{
     this.currentUser['active'] = false;
  console.log( this.currentUser['id'])
     console.log('User ist ausgeloggt')
     this.userService.setUserStatus(this.currentUser['id'], false);
 
    }).catch((err)=>{
     console.log(err.message);
    });
    localStorage.setItem('currentUserID', '');
   }

   openProfile(user){
    const dialogConfig = new MatDialogConfig();
       
    dialogConfig.data = { user: user};
    const dialogRef =  this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = this.user;
  
    this.dialogRef.close();
  }
}
