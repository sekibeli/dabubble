import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { DrawerService } from '../services/drawer.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { SmilyService } from '../services/smily.service';
import { PostService } from '../services/post.service';
import { MessageService } from '../services/message.service';

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
  showPicker: boolean = false;
  reactions;
  currentUserID;
  dateMessageBefore: string = '';
  newDate: boolean;
  constructor(private userService: UserService, private drawerService: DrawerService, private dialog: MatDialog, private smilyService: SmilyService, public postService: PostService, public messageService: MessageService) {


  }

  ngOnInit(): void {
    this.currentUserID = localStorage.getItem('currentUserID');
    this.getDetailsFromID(this.chat['fromID']);

    if (this.chat) {
      const fromID = this.chat['fromID'];
      const userID = localStorage.getItem('currentUserID');
      this.flip = fromID === userID;

      if (this.chat['fromID'] === this.chat['toID'])
        this.flip = false;
      // console.log(this.flip);
    }
if(!(this.chat['id'] == '')){  
    this.smilyService.getAllReactionsMessage(this.chat['id']).then((value) => {
      value.subscribe((reactions) => {
        console.log("reactions", reactions);

        this.reactions = reactions;

      });

    });
  }

    const currentDate = this.postService.getFormatedDateFromTimestamp(this.chat['timestamp']);
    this.newDate = currentDate !== this.messageService.getLastDate();

    if (this.newDate) {
      this.messageService.setLastDate(currentDate);
    }


  }


  isNewDate(message: string) {

    if (message !== this.dateMessageBefore) {
      this.dateMessageBefore = message;
      this.newDate = true;
    }
    else {
      this.newDate = false;
    }
  }

  getDetailsFromID(fromID) {
    this.userService.getCurrentUser(fromID).subscribe((user) => {
      this.messageAuthor = user;
    });
  }

  openProfile(user) {
    const dialogConfig = new MatDialogConfig();

    if (this.drawerService.isSmallScreen) {

      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }

    dialogConfig.data = { user: user };

    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;

  }

  addReaction(event, message) {
    // const smily = `${event.emoji.native}`;
    console.log(event);
    console.log(message);
    console.log(localStorage.getItem("currentUserID"));
    this.smilyService.saveReactionMessage(event, message['id'], localStorage.getItem('currentUserID'));
    this.showPicker = false;

  }
}





