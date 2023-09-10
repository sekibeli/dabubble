import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user.class';
import { signOut } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';
import { DrawerService } from '../services/drawer.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isSmallScreen;
  @Input() userLoggedIn_UID;
  @Input() currentUser;
  user: User;

  constructor(private afAuth: AngularFireAuth, private userService: UserService, private dialog: MatDialog, public drawerService: DrawerService) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    console.log('currentUser:', this.currentUser['id']);
    this.userService.setUserStatus(this.currentUser['id'], true);
    localStorage.setItem("currentUserName", this.currentUser['username']);
  }

  ngOnDestroy(): void {
    this.userService.setUserStatus(this.currentUser['id'], false);
  }

  logUserOut() {
    this.afAuth.signOut().then(() => {
      this.currentUser['active'] = false;
      this.userService.setUserStatus(this.currentUser['id'], false);

    }).catch((err) => {
      console.log(err.message);
    });
    localStorage.setItem('currentUserID', '');
  }

  openLogoutMenu() {
    const dialogConfig = new MatDialogConfig();
    if (this.isSmallScreen) {
      dialogConfig.position = {
        bottom: '0px',
        right: '0px',
        left: '0px'
      };
      dialogConfig.width = '100%';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';

    } else {
      dialogConfig.position = {
        top: '100px',  // Ändere diese Werte entsprechend deiner gewünschten Position
        right: '5%'   // Ändere diese Werte entsprechend deiner gewünschten Position
      };
    }
    this.dialog.open(DialogLogoutComponent, dialogConfig);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreenSize();
  }


  checkScreenSize() {
    if (window.innerWidth < 650) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }
}


