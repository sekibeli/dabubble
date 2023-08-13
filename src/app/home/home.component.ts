import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { DrawerService } from '../services/drawer.service';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
public isSmallScreen:boolean = false;
isDrawerOpen = true;
private drawerStateSubscription?: Subscription;

  @ViewChild('rightDrawer') public rightDrawer: MatDrawer
  @ViewChild('leftDrawer') public leftDrawer: MatDrawer;

public currentUser;
  public userLoggedIn_UID: string;
  // currentUser: User;
  users: Observable<any>;
  user: User;

  constructor(public userService: UserService, public authService: AuthService, public drawerService: DrawerService) { 
    this.checkScreenSize();
    // this.mobileQuery = media.matchMedia('(max-width: 600px)');
    // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);


   
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
    if(window.innerWidth < 600) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
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
}
