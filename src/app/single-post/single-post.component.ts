import { Component, Input, OnInit } from '@angular/core';
import { ThreadService } from '../services/thread.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DrawerService } from '../services/drawer.service';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
time;
singlePost: any;
author: any;
@Input() countsOfThreads;

  constructor(public threadService: ThreadService, private drawerService: DrawerService, private dialog: MatDialog){}

  ngOnInit() {
this.threadService.postForThread$.subscribe((post)=> {
  this.singlePost = post;
  this.threadService.author$.subscribe((author)=> {
    this.author = author;

this.time = new Date(this.singlePost['timestamp']).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
  })
})
  
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
  

