import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { DrawerService } from '../services/drawer.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit {
@Input() chat;
messageAuthor;
messageRecipient;
flip: boolean;

constructor(private userService: UserService, private drawerService: DrawerService, private dialog: MatDialog){


}

ngOnInit(): void {
  this.getDetailsFromID(this.chat['fromID']);

  if(this.chat){
    const fromID = this.chat['fromID'];
    const userID = localStorage.getItem('currentUserID');
    this.flip = fromID === userID;

    if(this.chat['fromID'] === this.chat['toID'])
    this.flip = false;
    // console.log(this.flip);
  }
  
  
}
getDetailsFromID(fromID){
  this.userService.getCurrentUser(fromID).subscribe((user)=>{
  
      this.messageAuthor = user;
      // console.log(this.messageAuthor);
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





