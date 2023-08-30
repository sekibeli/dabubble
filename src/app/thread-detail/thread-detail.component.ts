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
downloadUrl;
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

  convertBase64ToFile() {
    let base64Data = this.thread['file'];
  
    // Entfernen eines möglichen Daten-URI-Schemas
    const base64Header = 'base64,';
    const headerIndex = base64Data.indexOf(base64Header);
    if (headerIndex > -1) {
      base64Data = base64Data.substr(headerIndex + base64Header.length);
    }
  
    // Entfernen von Leerzeichen und Zeilenumbrüchen
    base64Data = base64Data.replace(/\s/g, '');
  
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      this.downloadUrl = window.URL.createObjectURL(blob);
    } catch (e) {
      console.error('Fehler bei der Umwandlung von Base64 zu Blob:', e);
    }
  }

}
