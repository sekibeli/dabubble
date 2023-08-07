import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.class';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('rightDrawer') public rightDrawer:MatDrawer
public currentUser;
  public userLoggedIn_UID: string;
  // currentUser: User;
  users: Observable<any>;
  user: User;

  constructor(public userService: UserService, public authService: AuthService, private drawerService: DrawerService) { 
    this.userLoggedIn_UID = this.authService.getCurrentUserIDFromLocalStorage();
    localStorage.setItem('channelMessage', 'true');

   
    console.log('ID currentUser: ',this.userLoggedIn_UID);
   
    this.userService.getCurrentUser(this.userLoggedIn_UID).subscribe(user => {
    
      // console.log('User:', user);
      this.currentUser = user;
   

   });
  }

  

  ngAfterViewInit(): void {
this.drawerService.setDrawer(this.rightDrawer);

  }
}
