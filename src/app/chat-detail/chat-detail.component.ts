import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { DrawerService } from '../services/drawer.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { SmilyService } from '../services/smily.service';
import { PostService } from '../services/post.service';
import { MessageService } from '../services/message.service';
import { DateService } from '../services/date.service';
import * as pdfjsLib from 'pdfjs-dist';
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
  public pdfDataUrl: string;  // Der Base64-kodierte PDF-String
  public isPDF: boolean = false;
  downloadUrl;
  @ViewChild('pdfCanvasMessage') pdfCanvasMessage: ElementRef;
  constructor(private userService: UserService, private drawerService: DrawerService, private dialog: MatDialog, private smilyService: SmilyService, public postService: PostService, public messageService: MessageService, private dateService: DateService) {


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

    const currentDate = this.dateService.getFormatedDateFromTimestamp(this.chat['timestamp']);
    this.newDate = currentDate !== this.dateService.getLastDate();

    if (this.newDate) {
      this.dateService.setLastDate(currentDate);
    }

    console.log('chat:',this.chat);
    this.loadPDF();
  } 


  // isNewDate(message: string) {

  //   if (message !== this.dateMessageBefore) {
  //     this.dateMessageBefore = message;
  //     this.newDate = true;
  //   }
  //   else {
  //     this.newDate = false;
  //   }
  // }

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

  loadPDF() {
    this.pdfDataUrl = this.chat ? this.chat['file'] : '';  // Setze einen leeren String, wenn this.post oder this.post['file'] undefined ist
    // this.pdfDataUrl = this.post['file'];
  console.log('chatimload:',this.chat['file']);
    if (this.pdfDataUrl && this.pdfDataUrl.startsWith('data:application/pdf')) {
      this.isPDF = true;
      console.log('isPDF', this.isPDF);
    }

    if (this.isPDF) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.js"
     
      // Laden und rendern des pdf
      const loadingTask = pdfjsLib.getDocument({ data: atob(this.pdfDataUrl.split('base64,')[1]) });

      loadingTask.promise.then(pdf => {
       
        return pdf.getPage(1);  // will Seite 1 anzeigen lassen
      }).then(page => {
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = this.pdfCanvasMessage.nativeElement;
        const context = canvas.getContext('2d');
        canvas.height = 200;  // oder eine andere Höhe
        const scale = 200 / viewport.height;
        const scaledViewport = page.getViewport({ scale });

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        page.render(renderContext);
      });
    }
  }
    
    downloadPDF() {
    // PDF herunterladen
    const link = document.createElement('a');
    link.href = this.pdfDataUrl;
    link.download = 'document.pdf';
    link.click();
  }
}





