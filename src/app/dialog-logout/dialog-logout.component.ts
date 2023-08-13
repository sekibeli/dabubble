import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-logout',
  templateUrl: './dialog-logout.component.html',
  styleUrls: ['./dialog-logout.component.scss']
})
export class DialogLogoutComponent {
  currentUser;

  constructor(private afAuth: AngularFireAuth, private userService: UserService, public dialogRef: MatDialogRef<DialogLogoutComponent>){
    this.currentUser = localStorage.getItem('currentUserID');
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
}
