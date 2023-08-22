import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss']
})
export class ThreadDetailComponent implements OnInit {
author;
@Input() thread;

// @Input() trueFalse: boolean;
time;
// formatedDate;


constructor(private userService: UserService, private dialog: MatDialog, private drawerService: DrawerService){
  
}

ngOnInit(){
  if(this.thread && this.thread.author){
    this.getAuthorDetails(this.thread);
  }
    this.time =  new Date(this.thread['timestamp']).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
    // console.log(this.trueFalse);
    // this.getFormatedDateFromTimestamp(this.thread['timestamp']);
}

getAuthorDetails(post){
  const userDataRef = this.userService.getCurrentUser(post['author']).subscribe((value)=>{
   
   
      this.author = value;
      
        
    });
  }

  openProfile(user){
    const dialogConfig = new MatDialogConfig();
     
    if (this.drawerService.isSmallScreen) {

      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
      }
    dialogConfig.data = { user: user};
   
    const dialogRef =  this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;
    
  }



}
