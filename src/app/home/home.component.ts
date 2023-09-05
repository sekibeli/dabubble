import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { DrawerService } from '../services/drawer.service';
import {MediaMatcher} from '@angular/cdk/layout';
import { AutologoutService } from '../services/autologout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  public rightDrawerMode = "side"
public isSmallScreen:boolean = false;
public isBigScreen:boolean = false;
public isMediumScreen:boolean = false;
isDrawerOpen = true;
private drawerStateSubscription?: Subscription;

  @ViewChild('rightDrawer') public rightDrawer: MatDrawer
  @ViewChild('leftDrawer') public leftDrawer: MatDrawer;

public currentUser;
  public userLoggedIn_UID: string;
  // currentUser: User;
  users: Observable<any>;
  user: User;

  constructor(public userService: UserService, public authService: AuthService, public drawerService: DrawerService, public autoLogoutService:AutologoutService) { 
    this.checkScreenSize();
   

   
    this.userLoggedIn_UID = this.authService.getCurrentUserIDFromLocalStorage();
    localStorage.setItem('channelMessage', 'true');
    

   
    console.log('ID currentUser: ',this.userLoggedIn_UID);
   
    this.userService.getCurrentUser(this.userLoggedIn_UID).subscribe(user => {
    
      // console.log('User:', user);
      this.currentUser = user;
   

   });
  }

  ngOnInit(): void {
    this.drawerService.setDrawer(this.leftDrawer);
    // this.drawerStateSubscription = this.drawerService.getDrawerState().subscribe((state)=> {
    //   this.isDrawerOpen = state;
    // });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreenSize();
  }
  

  ngAfterViewInit(): void {
this.drawerService.setDrawer(this.rightDrawer);

  }

  checkScreenSize() {
    if(window.innerWidth < 650) {
      this.isSmallScreen = true;
      this.rightDrawerMode = 'over'
    } else {
      this.isSmallScreen = false;
    }

    if(window.innerWidth > 1000){
      this.isBigScreen = true;
      this.rightDrawerMode = 'side'
    } else {}

    if(600 < window.innerWidth && window.innerWidth < 1000){
      this.isMediumScreen = true;
      this.rightDrawerMode = 'over';
    } else {
      this.isMediumScreen = false;
    }
  }

  toggleLeftDrawer(){
    this.drawerService.toggle();
  }
  ngOnDestroy(): void {
    if (this.drawerStateSubscription) {
      this.drawerStateSubscription.unsubscribe();
    }
  }

  goBack(){
    this.drawerService.toggle();
    // event.preventDefault();
    this.drawerService.setMyVariable(false);
  }
}
