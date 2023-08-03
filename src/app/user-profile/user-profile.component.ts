import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.class';
import { signOut } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  @Input()  userLoggedIn_UID;
  @Input() currentUser;
  user: User;

  constructor(private afAuth: AngularFireAuth, private userService: UserService) {
   
  }

  ngOnInit(): void {
    this.userService.setUserStatus(this.currentUser['id'], true);
   
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


