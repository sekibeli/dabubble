import { Component, Input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
public currentUser;
  public userLoggedIn_UID: string;
  // currentUser: User;
  users: Observable<any>;
  user: User;

  constructor(public userService: UserService, public authService: AuthService) { 
    this.userLoggedIn_UID = this.authService.getCurrentUserIDFromLocalStorage();
    console.log('constructor home');
    console.log('ID home: ',this.userLoggedIn_UID);
   this.userService.getCurrentUser(this.userLoggedIn_UID).then(currentUser => {
      currentUser.subscribe(user => {
      console.log(user);
      this.currentUser = user;
    })

   });

    
   
    
// this.currentUser = new User(this.authService.currentUser);

  }

  ngOnInit(): void {

    // this.userService.getUserData().subscribe(user => {
    //   console.log('Daten aus Observable in home: ', user);
    //   this.user = user;
    // }, error => {
    //   console.error('Es gab einen Fehler beim Abruf der Daten:', error);
    // });

    //Test
    // let oneuser = this.authService.getCurrentUserFromLocalStorage();

    // console.log('test:', this.authService.currentUser);
  }
}
