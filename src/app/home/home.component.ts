import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userLoggedIn_UID : string; 
  currentUser: any;
  users: any;
  user: any;

  constructor(public userService: UserService, public authService: AuthService){



   
    
  }

 ngOnInit(): void {
   this.userService.getUserData().subscribe(user => {
    console.log(user);
    this.user = user;
   }, error => {
    console.error('Es gab eine fahler beim Abruf der Daten:', error);
   });

   this.userLoggedIn_UID = this.authService.userUID;
  

setTimeout(()=> { this.authService.getCurrentUser(this.authService.userUID);},3000)
   
    
   
  //  console.log('Hier die ID:',this.userLoggedIn_UID);
   
  //  if(this.authService && this.authService.userUID){
  //   this.authService.userUID.subscribe(uid => {this.userLoggedIn_UID = uid});
  // } else {
  //   console.log('authService noch nicht da');
  // }
  //  this.authService.userUID.subscribe(uid => {
  //   console.log(uid);
  //  })
 }
 testfunktion(){
  console.log('Home Comp. Ausserhalb: ', this.authService.userUID);
}



}
